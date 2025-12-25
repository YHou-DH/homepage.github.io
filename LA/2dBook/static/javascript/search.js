var searchElement = document.querySelector('.search');
var searchInput = document.getElementById('searchInput');
var suggestions = document.getElementById('suggestions');
var suggestionsname = ['01. 合脚離開一寸闊 (Standing with the feet about one inch apart)',
 '02. 兩手揸拳藏在腰 (Holding the fists by the waist)',
 '03. 抽上胸中一切出 (Lifting the fists and pushing forward the palms from the side of chest)',
 '04. 反手抽拳對膀肩 (Lifting the hammer fists toward the shoulders)',
 '05. 橫迫三株標串掌 (Thrice side extending hands followed by throwing elbow, downward palm block and target hand)',
 '06. 沉踭一定指撐天 (Descending the elbows with the palms facing the sun)',
 '07. 右手揸拳左用掌 (Right hand holding the fist and the left holding the palm)',
 '08. 吊腳收胸見禮謙 (Saluting with a cat stance)',
 '09. 扭手收拳歸原位 (Pulling back the fists toward the side of the waist)',
 '10. 腳肘開發落四平 (Posing a horse stance in four steps)',
 '11. 抽拳在胸雙切膀 (Pulling up fists to throw the lower double forearm block)',
 '12. 合掌分開定金橋 (Palms up facing each other followed by the stabilizing bridge)',
 '13. 一指三株拋肘手 (Thrice forward extending hands)',
 '14. 連拋三次有三勻 (Thrice throwing elbows followed by arm-drag claws and double-palm strike)',
 '15. 四拋標串撐天指 (Downward double-palm block followed by the forward target hands and facing-the-sun palms)',
 '16. 雙抽雙割一揸分 (Double splitting and curving palms followed by the divide punch)',
 '17. 出左吊右拉歸後 (Transitioning via a cat stance to launch the right leg block)',
 '18. 鏟腳四平八分馬 (Blocking with groin stop kick)',
 '19. 子午連轉單膀手 (Lower forearm block with a bow stance)',
 '20. 一挑擰馬千字落 (Splitting and turning followed by upper knife hand block and downward chop)',
 '21. 抽手轉身割歸後 (Withdrawing the hand and turning with the curving palm)',
 '22. 上馬連變側掌打 (Advancing with the horizontal palm strike)',
 '23. 四平肘頂標串出 (Side elbow strike with a horse stance followed by the knifehand strike)',
 '24. 割手四平掌打正 (Curving palm with a horse stance follow by the palm strike)',
 '25. 一揸抽手轉一分 (Pulling back the fist to launch a back fist punch)',
 '26. 出右吊左拉歸後 (Transitioning via a cat stance to launch the right leg block)',
 '27. 鏟腳四平馬八分 (Blocking with groin stop kick)',
 '28. 子午一轉右膀手 (Lower forearm block with a bow stance)',
 '29. 一挑擰馬右千字 (Splitting and turning followed by upper knife hand block and downward chop)',
 '30. 抽手轉身割歸後 (Withdrawing the hand and turning with the curving palm)',
 '31. 上馬連出一側掌 (Advancing with the horizontal palm strike)',
 '32. 四平肘頂標串手 (Side elbow strike with a horse stance followed by the knifehand strike)',
 '33. 割手四平掌打正 (Curving palm with a horse stance follow by the palm strike)',
 '34. 一揸一抽轉一分 (Pulling back the fist to launch a back fist punch)',
 '35. 出左踏右吊腳馬 (Stepping with the left foot to defend with a cat stance)',
 "36. 照鏡手法爪三勻 (Reconciling using the looking-in-the-mirror palm followed by double tiger claw strikes to the opponent's face)",
 '37. 帶馬歸槽拉轉後 (Turning while dragging the horse back to the stable)',
 '38. 貓兒洗面又三勻 (Striking with the double tiger claws three times again)',
 '39. 帶馬扭身再拉後 (Turning while dragging the horse)',
 '40. 右腳一齣子午馬 (Advancing one step with the bow stance)',
 '41. 前弓後箭雙切膀 (Front block using the double lower forearm block)',
 '42. 左上右落千字手 (Blocking with a knife hand chop quickly followed by the double reverse knife hand strike)',
 '43. 拉馬抽拳雙掛落 (Pullback followed by striking with the double hanging back fists and then knife hand thrust)',
 '44. 進馬兜肘雙虎爪 (Advancing with double palm/claw strike)',
 '45. 牛角一槌轉通天 (Striking with a hook and uppercut)',
 '46. 回馬拋肘上四勻 (Turning with throwing elbow stike for four times)',
 '47. 轉身向後四平馬 (Turning around to a horse stance with the double palm strike)',
 '48. 雙膀切落合掌分 (Lifting and pushing forward the palms forward after the lower double forearm block)',
 '49. 一指撐天三株出 (Thrice forward extending hands)',
 '50. 標串手法定金橋 (Forward target hands followed by the stabilizing bridge)',
 '51. 雙抽雙割一揸分 (Double splitting and curving palms followed by the divide punch)',
 "52. 蝶掌一迫分漏手 (Butterfly palm strike followed by the arm drag and forcing elbow strike combo to hit via splitting the opponent's body block)",
 "53. 再撤蝶掌迫分漏 (Butterfly palm strike followed by the arm drag and forcing elbow strike combo to hit via splitting the opponent's body block)",
 "54. 撤掌連環抅彈腳 (Withdrawing palms to grab the opponent's elbow, lock and sweep)",
 '55. 斜風擺柳轉車身 (Retreating steps while turning the body)',
 '56. 雙膀切落起左右 (Double lower forearm block followed by splitting hand and upper knife hand block)',
 '57. 一撇一劃千字手 (Double reverse knife hand strike following the block)',
 '58. 拉馬抽拳雙掛落 (Striking with the double hanging back fists and then knife hand thrust)',
 '59. 進馬兜肘雙虎爪 (Advancing with double palm/claw strike)',
 '60. 牛角一槌轉通天 (Striking with a hook and uppercut)',
 '61. 坐馬單橋槌進步 (Crossing bridge with the horse stance followed by an advancing punch)',
 '62. 拉馬一頂碌肘撇 (Fighting backwards with the side elbow strike followed by the rolling elbow strike)',
 '63. 回頭蝶掌莫延遲 (A quick turn to fight backwards with the knife hand chop followed by butterfly palm strike)',
 '64. 黑虎槌法連環打 (The black-tiger punch combination)',
 '65. 蝴蝶一掌麒麟步 (Forcing with the butterfly palm strike via unicorn steps)',
 '66. 連環蝶掌步麒麟 (Butterfly palm strike toward another direction via unicorn steps)',
 '67. 右抽一拳連打出 (Clipping hammer fists to the right)',
 '68. 左右連環一樣同 (Clipping hammer fists to the left)',
 '69. 轉身單掛槌中出 (Turning with the backfist block followed by a straight punch to the right)',
 '70. 拉馬轉身掛打槌 (Turning with the backfist block followed by a straight punch to the left)',
 '71. 向前掛打連環落 (Turning with the backfist block followed by a straight punch to the front)',
 '72. 後腳一拉千字手 (Turning around to block with the knife hand chop)',
 '73. 進馬一槌定肘出 (Advancing with a straight punch followed by the side elbow strike)',
 '74. 分漏單掛轉金龍 (Block breaking for back fist and claw strikes followed by dodging with pushing claws)',
 '75. 子午一掌虎尾腳 (Bow stance palm strike followed by the tiger tail kick)',
 '76. 轉身蛇形又搶珠 (Stepping back like a snake followed by the two finger strike to the eyes)',
 "77. 飯匙頭起蛇擺尾 (Lifting hands to hammer backwards and twisting to hit the lower body like a a snake's tail)",
 '78. 轉身一跳碌鼓槌 (Jump turn followed by the water crest throwing hammer fist)',
 '79. 出右攻迫左側掌 (Upper forcing chop to the right followed by horizontal palm strike)',
 '80. 左馬攻迫側掌來 (Upper forcing chop to the left followed by horizontal palm strike)',
 '81. 上右子午出膀手 (Switching to right bow stance with forearm block)',
 '82. 千斤一墜鐵門閂 (Lowering the body to block with the latching hammer fist)',
 '83. 跳馬猛弓射箭槌 (A quick jump followed by the rocket hammer fist)',
 '84. 抅彈一迫黑虎爪 (Hook sweep and forcing with the black tiger claws)',
 '85. 退馬金龍爪獻來 (Stepping back and strike backwards with the dragon claws)',
 '86. 轉身一橋槌打出 (Turning with the crossing bridge followed by a straight punch)',
 '87. 吊腳纏枝一槌來 (Tangling palms with a cat stance followed by a straight punch)',
 '88. 左右連環各一勻 (Repeating the tangling palms and punch combination)',
 '89. 蝶掌一捋分左右 (Block breaking using butterfly palms)',
 '90. 三星連環黑虎爪 (Striking with the hanging-blocking-knuckling punch combination followed by the black tiger claws)',
 '91. 轉身一橋又一槌 (Turning with the crossing bridge followed by a straight punch)',
 '92. 收拳見禮須吊腳 (Pulling back the fist and saluting with a cat stance)',
 '93. 扭手收拳一鞠躬 (Standing up and bowing)']

searchElement.addEventListener('click', function(event) {
    this.style.width = '76%';
    this.style.left = "55%";
    this.style.height = "2.2em";
    this.style.borderRadius = '0.6em';
    this.style.cursor = 'default';

    setTimeout(function() {
        document.getElementById('searchInput').classList.remove('hidden');
    }, 300);

    event.stopPropagation();
});

searchInput.addEventListener('click', function(event) {
    event.stopPropagation();
});

suggestions.addEventListener('click', function(event) {
    event.stopPropagation();
});

document.addEventListener('click', function(event) {
    var isClickInsideSearchElement = searchElement.contains(event.target);
    var isClickInsideSearchInput = searchInput.contains(event.target);
    var isClickInsideSuggestions = suggestions.contains(event.target);

    if (!isClickInsideSearchElement && !isClickInsideSearchInput && !isClickInsideSuggestions) {
        searchElement.style.width = '2em';
        searchElement.style.left = '50%';
        searchElement.style.height = '1em';
        searchElement.style.borderRadius = '50%';
        searchElement.style.cursor = 'pointer';

        searchInput.value = '';
        searchInput.classList.add('hidden');

    }
});

let currentFocus = -1;

function clearAndHideSuggestions() {
    var suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.classList.add('hidden');
    currentFocus = -1; // 重置当前焦点
}

function addActive(items) {
    if (!items) return false;
    removeActive(items);
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (items.length - 1);
    items[currentFocus].classList.add('active');
}

function removeActive(items) {
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
}

document.getElementById('searchInput').addEventListener('input', function() {
    var input = this.value;
    var suggestionsContainer = document.getElementById('suggestions');

    suggestionsContainer.innerHTML = '';

    if (input.length > 0) {

        suggestionsname.forEach(function(suggestion) {
            if (suggestion.toLowerCase().includes(input.toLowerCase())) {
                var div = document.createElement('div');
                div.textContent = suggestion;
                div.onclick = function() {
                    document.getElementById('searchInput').value = suggestion;
                    clearAndHideSuggestions();
                    var num = suggestion.match(/\d+/)[0];
                    var suggestion_for_label = 'taming_tiger_' + num;

                    const circle_bar = d3.select('#circle-bar');
                    const circles = circle_bar.selectAll('circle');
                    loadAndProcessData(function() {
                        if (activeNode !== null) {
                            const an = d3.select('#page2').select('#circle-bar')
                                .selectAll('circle').filter(function (c) {
                                    return c.properties.rdfs__label === activeNode.properties.rdfs__label;
                                });
                            if (an.imgElement) {
                                an.imgElement.remove();
                                an.imgElement = null;
                            }
                            d3.selectAll('.dynamic-img ').remove();
                            circles.style('filter', '').classed('reco-nodes', false);
                            circle_bar.selectAll(".reco-link").remove();
                            circles.style('opacity', 1);
                            activeNode = null;
                            autoNode = null;
                        }

                        const nodeInPage2 = d3.select('#page2').select('#circle-bar')
                            .selectAll('circle').filter(function(c) {
                                return c.properties.rdfs__label === suggestion_for_label;
                            });
                        nodeInPage2.dispatch('click');
                    });
                };
                suggestionsContainer.appendChild(div);
            }
        });

        suggestionsContainer.classList.remove('hidden');
    } else {
        clearAndHideSuggestions();
    }
});

// 键盘
document.getElementById('searchInput').addEventListener('keydown', function(e) {
    var suggestionsBox = document.getElementById('suggestions');
    var items = suggestionsBox.getElementsByTagName('div');
    if (e.keyCode == '40') {
        // 向下箭头
        currentFocus++;
        addActive(items);
    } else if (e.keyCode == '38') {
        // 向上箭头
        currentFocus--;
        addActive(items);
    } else if (e.keyCode == '13') {
        // 回车键
        e.preventDefault();
        if (currentFocus > -1) {
            if (items) items[currentFocus].click();
        }
    }
});
