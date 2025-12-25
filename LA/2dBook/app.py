from flask import Flask, request, jsonify, render_template
from neo4j import GraphDatabase
import pandas as pd
import logging
import sys

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)

# local DB
#uri = "bolt://localhost:7687"
#driver = GraphDatabase.driver(uri, auth=("neo4j", "00000000"))

# Aura DB
uri = "neo4j+s://df7e249d.databases.neo4j.io"
driver = GraphDatabase.driver(uri, auth=("neo4j", "s3BziIvtF7fUzFB1S6kvpb-SugFH5qoPngEp15_oJjE"))

# Aura DB - free
# uri = "neo4j+s://e581db14.databases.neo4j.io"
# driver = GraphDatabase.driver(uri, auth=("neo4j", "Sl53GbHb1y6IXFQ9jfH_7C3qvwHMOd5G6mUcYKTBm6g"))



@app.route('/')
def index():
    return render_template("index.html")

@app.route('/welcome')
def welcome():
    return render_template("welcome.html")

@app.route('/second-page')
def your_function():
    node_rdfs_label = request.args.get('node_rdfs_label')
    node_rdfs_label = str(node_rdfs_label)
    query1 = "MATCH (n) WHERE properties(n).rdfs__label = $node_rdfs_label RETURN n"
    query2 = "MATCH (n)-[r]-(m) WHERE properties(n).rdfs__label = $node_rdfs_label AND type(r) <> $r_is_form_in \
             OPTIONAL Match (m)-[e:ns1__employs]->(k) \
             OPTIONAL Match (k)-[e2:ns1__employs]->(kk) \
             RETURN n, r, m, e, k, e2, kk"
    param = {"node_rdfs_label": node_rdfs_label, "r_is_form_in": "ns1__is_form_in"}

    # app.logger.debug('Node rdfs label: %s', node_rdfs_label)

    if node_rdfs_label is not None:
        with driver.session() as session:
            node_metadata = session.run(query1, param).single()
            node_properties = dict(node_metadata[0]) if node_metadata else {}  # 将节点属性转换为字典

        # app.logger.debug('Node properties: %s', node_properties)

        with driver.session() as session:
            results = session.run(query2, param)
            data = format_results_to_json(results)

        # app.logger.debug('data: %s', data)

        video_rdfs_mapping = pd.read_csv("static/data/video_timestamp.csv")
        video_info_get = video_rdfs_mapping[video_rdfs_mapping["rdfs__label"] == node_rdfs_label]
        videoInfo = {"startTime": int(video_info_get.ts_start_sec.values[0]),
                     "endTime": int(video_info_get.ts_end_sec.values[0]),
                     "info": str(video_info_get.mnemonic_EN.values[0])}
        # app.logger.debug('videoInfo: %s', videoInfo)

        recoInfo, recoLinks = get_recommendations(node_rdfs_label)
        # app.logger.debug('recoInfo: %s', recoInfo)

        return jsonify({"node_properties": node_properties, "data": data, "videoInfo": videoInfo,
                        "recoInfo": recoInfo, "recoLinks": recoLinks})
    else:
        return jsonify({'error': 'Missing nodeId parameter'}), 400
    # except Exception as e:
    #     app.logger.error('Failed to fetch second page', exc_info=e)
    #     return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

def format_results_to_json(results):
    data = []
    for record in results:

        data.append(
            {'source_zh': dict(record["n"])['ns1__ontoMA_name_zh'],
             'source_en': dict(record["n"])['ns0__name_en'],
             'source_rdfs_label': dict(record["n"])['rdfs__label'],
             'source_labels': "<br>".join([lb.split(":")[-1] for lb in list(record["n"].labels) if 'class' in lb]),
             'target_zh': dict(record["m"])['ns1__ontoMA_name_zh'],
             'target_en': dict(record["m"])['ns0__name_en'],
             'target_rdfs_label': dict(record["m"])['rdfs__label'],
             'target_labels': "<br>".join([lb.split(":")[-1] for lb in list(record["m"].labels) if 'class' in lb]),
             'type': record["r"].type.split('__')[1]})

        if record["e"] is not None and record["k"] is not None:
            data.append({
                'source_zh': dict(record["m"])['ns1__ontoMA_name_zh'],
                'source_en': dict(record["m"])['ns0__name_en'],
                'source_rdfs_label': dict(record["m"])['rdfs__label'],
                'source_labels': "<br>".join([lb.split(":")[-1] for lb in list(record["m"].labels) if 'class' in lb]),
                'target_zh': dict(record["k"])['ns1__ontoMA_name_zh'],
                'target_en': dict(record["k"])['ns0__name_en'],
                'target_rdfs_label': dict(record["k"])['rdfs__label'],
                'target_labels': "<br>".join([lb.split(":")[-1] for lb in list(record["k"].labels) if 'class' in lb]),
                'type': record["e"].type.split('__')[1]
            })

        if record["e2"] is not None and record["kk"] is not None:
            data.append({
                'source_zh': dict(record["k"])['ns1__ontoMA_name_zh'],
                'source_en': dict(record["k"])['ns0__name_en'],
                'source_rdfs_label': dict(record["k"])['rdfs__label'],
                'source_labels':"<br>".join([lb.split(":")[-1] for lb in list(record["k"].labels) if 'class' in lb]),
                'target_zh': dict(record["kk"])['ns1__ontoMA_name_zh'],
                'target_en': dict(record["kk"])['ns0__name_en'],
                'target_rdfs_label': dict(record["kk"])['rdfs__label'],
                'target_labels': "<br>".join([lb.split(":")[-1] for lb in list(record["kk"].labels) if 'class' in lb]),
                'type': record["e2"].type.split('__')[1]
            })
    return data

def get_recommendations(label):

    df = pd.read_csv('static/data/form_reco.csv')
    id_to_label = pd.Series(df.rdfs__label.values, index=df.id).to_dict()
    row = df[df['rdfs__label'] == label]
    id_ = int(row['id'].values[0])
    if row.empty:
        return "Label not found"
    result = {"label": int(id_), 'recomd': []}
    links = []
    for i in range(1, 4):
        reco_id = row.iloc[0]['reco{}_id'.format(i)]
        reco_type = row.iloc[0]['reco{}_type'.format(i)]
        if pd.notna(reco_id) and pd.notna(reco_type):
            if id_to_label.get(reco_id, 0) != 0:
                # result['recomd'].append({"recomd_label": id_to_label.get(reco_id, "ID not found"), "recomd_type": reco_type})
                result['recomd'].append({"recomd_label": int(reco_id), "recomd_type": reco_type})
                links.append({'start': id_, 'end': int(reco_id), 'type': reco_type})
    return result, links

if __name__ == "__main__":
    app.env = 'development'
    app.run(debug=False)

