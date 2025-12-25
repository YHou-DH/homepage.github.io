$(document).ready(function()
{
    $('.page').css("display", "none");
    $('.button_start').click(function()
    {
        $('.intro').addClass('fadeout');
        setTimeout(function(){
          $('.intro').css("display", "none");
          $('.introG').css("display", "block");
          $('.introG').addClass('largein');
          $('.gungL').addClass('moveL');
          $('.gungR').addClass('moveR');
        }, 800);
        setTimeout(function(){
          $('.page').css("display", "block");
          $('.page').addClass('appear');
          
          $('.guide1').css("display", "block");
          $('.guide1').addClass("appear");
        }, 3500);
        setTimeout(function(){
          $('.introG').css("display", "none");
          $('.guide1').css("opacity", "1");
        }, 3800);
     });

    $('.footer_rec').click(function()
    {
      if ($(".legend_rec").hasClass('unfolded'))
      {
        $('.legend_rec').addClass('folded');
        $('.legend_rec').removeClass('unfolded');
        setTimeout(function(){
          $('.legend_rec').css("display", "none");
        }, 200);
      } else {
        $('.legend_rec').css("display", "block");
        $('.legend_rec').addClass('unfolded');
        $('.legend_rec').removeClass('folded');
      }
    });

    $('.legend_rec').click(function()
    {
      $('.legend_rec').addClass('folded');
        $('.legend_rec').removeClass('unfolded');
        setTimeout(function(){
          $('.legend_rec').css("display", "none");
        }, 200);
    });

    $('.footer_e').click(function()
    {
      if ($(".legend_e").hasClass('unfolded_e'))
      {
        $('.legend_e').addClass('folded_e');
        $('.legend_e').removeClass('unfolded_e');
        setTimeout(function(){
          $('.legend_e').css("display", "none");
        }, 200);
      } else {
        $('.legend_e').css("display", "block");
        $('.legend_e').addClass('unfolded_e');
        $('.legend_e').removeClass('folded_e');
      }
    });
    $('.legend_e').click(function()
    {
      $('.legend_e').addClass('folded_e');
        $('.legend_e').removeClass('unfolded_e');
        setTimeout(function(){
          $('.legend_e').css("display", "none");
        }, 200);
    });
    // XY
    $('.side-bar').click(function()
    {
      if ($(".legend_s").hasClass('unfolded_s'))
      {
        $('.legend_s').addClass('folded_s');
        $('.legend_s').removeClass('unfolded_s');
        setTimeout(function(){
          $('.legend_s').css("display", "none");
        }, 200);
      } else {
        $('.legend_s').css("display", "block");
        $('.legend_s').addClass('unfolded_s');
        $('.legend_s').removeClass('folded_s');
      }
    });
    $('.legend_s').click(function()
    {
      $('.legend_s').addClass('folded_s');
        $('.legend_s').removeClass('unfolded_s');
        setTimeout(function(){
          $('.legend_s').css("display", "none");
        }, 200);
    });
});