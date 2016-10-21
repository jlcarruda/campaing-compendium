<!DOCTYPE html>
<html>
<!--
        HTML que trabalha com modals
 -->
    <head>
        <meta charset="utf-8">
        <title>Campaign Compendium</title>
        <link rel="stylesheet" type="text/css" href="styles/index-style-v2.css">
        <link rel="stylesheet" type="text/css" href="styles/style.css">
        <script src="js/utils.js"></script>
        <script type="text/javascript">
        var nw = require('nw.gui')
        var win = nw.Window.get()
        </script>

        <script src="../node_modules/jQuery/tmp/jquery.js"></script>
        <script src="../node_modules/jquery-ui/jquery-ui.js"></script>
        <script src="js/header.js"></script>
    </head>
    <body>
        <div id="header" class="header top-layer">
            <div id="windowControls" class="windowControls">
                <button href="#" title="Close" id="windowControlMinimize" onclick="win.minimize()">_</button>
                <button href="#" title="Close" id="windowControlClose" onclick="win.close()">X</button>
            </div>

            <input draggable="false"  id="char-button" class="button-image" type="image" src="imgs/campaing-header-button.png" name="name" onclick="onCampaingClick()">
            <input draggable="false"  id="char-button" class="button-image" type="image" src="imgs/personagens-header-button.png" name="name" onclick="onCharacterClick()" style="margin-left: 350px">
        </div>

        <div draggable="false" id="workspace" class="workspace working-layer">

        </div>

        <img draggable="false" src="./imgs/flame-gif.gif" style="width:100%; height:100%; mix-blend-mode:overlay; opacity:0.7;"/>

        <script type="text/javascript">
            $(function() {
                $('body').on('mousedown', '.workspace-item', function(event) {

                    console.log(event.target);
                    if($(event.target).attr('class') !== 'workspace-item'){
                        return;
                    }

                    $(this).addClass('draggable').parents().on('mousemove', function(e) {
                        $('.draggable').offset({
                            top:  e.pageY,
                            left: e.pageX - $('.draggable').outerWidth() / 2
                        }).on('mouseup', function() {
                            $(this).removeClass('draggable');
                        });

                    });
                    event.preventDefault();
                }).on('mouseup', function() {
                    $('.draggable').removeClass('draggable');
                });

                $('.workspace').mouseleave(function (){
                    $('.draggable').removeClass('draggable');
                });
            });

        </script>
    </body>
</html>
