$(document).ready(function()
{
  $('.next1').click(function()
    {
        $('.gd1').addClass('disap');
        $('.gdb1').addClass('disap');
        $('.next1').addClass('disap');
        $('.gd2').addClass('appear');
        $('.gdb2').addClass('appear');

        setTimeout(function(){
          $('.gdb1').css("display", "none");
          $('.gd1').css("display", "none");
          $('.next1').css("display", "none");
          $('.gd2').css("display", "block");
          $('.gdb2').css("display", "block");
          $('.next2').css("display", "block");
        }, 500);

    });

    $('.next2').click(function()
    {
        $('.gd2').addClass('disap');
        $('.gdb2').addClass('disap');
        $('.next2').addClass('disap');
        $('.gd3').addClass('appear');
        $('.gdb3').addClass('appear');

        setTimeout(function(){
          $('.gdb2').css("display", "none");
          $('.gd2').css("display", "none");
          $('.next2').css("display", "none");
          $('.gd3').css("display", "block");
          $('.gdb3').css("display", "block");
          $('.endgd').css("display", "block");
        }, 500);

    });

    $('.endgd').click(function()
    {
        $('.gd_box').addClass('disap');
        $('.endgd').addClass('disap');
        $('.guide1').addClass('disap');
        $('.infobox').addClass('disap');

        setTimeout(function(){
          $('.infobox').css("display", "none");
          $('.gd_box').css("display", "none");
          $('.endgd').css("display", "none");
          $('.guide1').css("display", "none");
        }, 500);

     });

    $('.btntask1').click(function()
    {
        $('.imgtask1').addClass('appear');
        $('.closeimg').addClass('appear');

        setTimeout(function(){
          $('.imgtask1').css("display", "block");
          $('.closeimg').css("display", "block");
        }, 500);
     });

    $('.closeimg').click(function()
    {
        
        $('.imgtask1').addClass('disap');
        $('.closeimg').addClass('disap');
        $('.btntask1').addClass('disap');
        $('.btntask2').addClass('appear');

        setTimeout(function(){
          $('.imgtask1').css("display", "none");
          $('.btntask1').css("display", "none");
          $('.closeimg').css("display", "none");
          $('.btntask2').css("display", "block");
        }, 500);
     });

    $('.btntask2').click(function()
      {

        $('.infonode').addClass('appear');
        clickable();
        d3.select("#Gtaming_tiger_23")
          .style("stroke", "red")
          .style("stroke-width", "6px")

        setTimeout(function(){
          $('.infonode').css("display", "block");
        }, 300);

     });

});