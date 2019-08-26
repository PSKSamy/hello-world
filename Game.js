/*created by Samy on 01.02.2019*/
/*version 1.0.0*/

/* global baseContainer, phaserGame, gameContainer, customizeHandler, _methodsConstants, Phaser, Preloader, INFOFONT, CURRENCY_ID, _webServiceHandler, BALL_ALPHA_LETTERS, WORD_THEMES, PRIZE_VALUES, TOTAL_CLICKS, INSTANT_PRIZE, CHARACTER_AND_POSITIONS, WIN_AMOUNT, GOES_COUNT, SELECTED_CHARACTERS, _infoPanel, _footerPanel, CREDIT_AMT, WINNING_AMT, GAME_ENTRY_FEE, _sounds */

var game = function(){
    this.totalClicks = 12;
    this.clickCounts = 0;
    this.ballCount = 0;
    this.climbingManPositions = [{wallY:-995.5,manX:242,manY:660},{wallY:-995.5,manX:322,manY:613},{wallY:-895.5,manX:282,manY:613},{wallY:-825.5,manX:312,manY:613},{wallY:-750.5,manX:282,manY:613},{wallY:-660.5,manX:312,manY:613},{wallY:-585.5,manX:282,manY:613},{wallY:-500.5,manX:312,manY:613},{wallY:-420.5,manX:282,manY:613},{wallY:-330.5,manX:312,manY:613},{wallY:-250.5,manX:282,manY:613},{wallY:-180.5,manX:312,manY:613},{wallY:-100.5,manX:282,manY:613}];
    this.gameWordObjects = [];
    this.instantPrizeObjects = [];
    this.letterBalls = [];
    this.instantPrizeSymbols = [];
    this.selectedBallNum = -1;
    this.winCount = 0;
};
var _game = new game();

game.prototype.init = function(){
    this.game_container = phaserGame.add.group(gameContainer,baseContainer,true);
    this.currencyId = (CURRENCY_ID === "PTS") ? "" : _methodsConstants.convertCurrencySymbol(CURRENCY_ID);
    //this.drawGameBoundary();
    this.addLogos();
    this.addAssetsBackgrounds();
    this.addClimbingWall();
    this.addLetterBalls();
    this.addCountDown();
    this.addPrizeWords();
    this.addPrizeValues();
    if(GOES_COUNT > 0){
        this.updateTheInbetweenData();
        this.showPopupForPreviousData(Preloader.previousGameAlertMsg,"previousGame");
    }
    _footerPanel.updateTheCreditAmount(CREDIT_AMT);
    _footerPanel.updateTheWinningAmount(WINNING_AMT);
    _footerPanel.updateTheBetAmount(GAME_ENTRY_FEE);
    _footerPanel.updateTheWinAmount("0");
    _infoPanel.init();
};

game.prototype.addLogos = function(){
    gameLogo = phaserGame.add.sprite(0,0,'gameLogo-1');
    gameLogo.x = (phaserGame.world.centerX)-50;
    gameLogo.y = 20;
    gameLogo.animations.add('bowlOpen');
    gameLogo.frame = 71;
    gameLogo.scale.x = 1.2;
    gameLogo.scale.y = 1.2;
    gameLogo.anchor.set(0.5);
    this.game_container.add(gameLogo);
    
    companyLogo = new customizeHandler.Image(15,25,'gi_logo-1');
    //companyLogo.x = 560;//0+(companyLogo.width/2)-150;
    //companyLogo.y = (phaserGame.world.centerY)+ 490;
    companyLogo.scale.x = 0.55;
    companyLogo.scale.y = 0.55;
    //companyLogo.anchor.set(0.5);
    this.game_container.add(companyLogo);
};

game.prototype.drawGameBoundary = function(){
    rect = _methodsConstants.drawRectangle(0,0X000000,1920,1200);
    rect.alpha = 0.5;
    this.game_container.add(rect);
};

game.prototype.addAssetsBackgrounds = function(){
    autoReveal = phaserGame.add.sprite(0,0,'autoReveal_bg');
    autoReveal.x = phaserGame.world.centerX;
    autoReveal.y = phaserGame.world.centerY-390;
    autoReveal.anchor.set(0.5);
    this.game_container.add(autoReveal);
    AUTOREVEAL_TXT_STYLE = {fill: '#FF0000',font:'70px '+INFOFONT,align: 'right',wordWrap: true,fontWeight:'bold',wordWrapWidth: 320};
    autoRevealTxt = phaserGame.add.text(autoReveal.x, autoReveal.y, Preloader.autoReveal, AUTOREVEAL_TXT_STYLE);
    autoRevealTxt.x = autoRevealTxt.x - autoRevealTxt.width/2;
    autoRevealTxt.y = autoRevealTxt.y - autoRevealTxt.height/2;
    this.game_container.add(autoRevealTxt);
    
    this.lettersBg = phaserGame.add.sprite(0,0,'letter_bg');
    this.lettersBg.x = phaserGame.world.centerX-130;
    this.lettersBg.y = 575;//phaserGame.world.centerY;
    this.lettersBg.anchor.set(0.5);
    this.game_container.add(this.lettersBg);
    
    this.prizePanel = phaserGame.add.sprite(0,0,'prize_panel');
    this.prizePanel.x =  this.lettersBg.x + this.lettersBg.width/2 + this.prizePanel.width/2;
    this.prizePanel.y = 535;//phaserGame.world.centerY;
    this.prizePanel.anchor.set(0.5);
    this.game_container.add(this.prizePanel);
    
    PRIZEPANEL_TITLE_TXT_STYLE = {fill: '#090C70',font:'40px Arial',align: 'right',wordWrap: true,fontWeight:'bold',wordWrapWidth: 450};
    prizePanelTitleTxt = phaserGame.add.text(0, 0, Preloader.prizepanelTitle, PRIZEPANEL_TITLE_TXT_STYLE);
    prizePanelTitleTxt.x = this.prizePanel.x;
    prizePanelTitleTxt.y = this.prizePanel.y-this.prizePanel.height/2+150;
    prizePanelTitleTxt.anchor.set(0.5);
    this.game_container.add(prizePanelTitleTxt);
    
    instantTitleTxt = phaserGame.add.text(0, 0, Preloader.instantPrizeTitle, PRIZEPANEL_TITLE_TXT_STYLE);
    instantTitleTxt.x = this.prizePanel.x;
    instantTitleTxt.y = this.prizePanel.y+this.prizePanel.height/2-180;
    instantTitleTxt.anchor.set(0.5);
    this.game_container.add(instantTitleTxt);
    
    for(var i=0; i<INSTANT_PRIZE.length; i++){
         instantPrize_bg = phaserGame.add.sprite(0,0,'instantPrize_bg');
         instantPrize_bg.x =  Number(Preloader.xml.querySelector('[id="STARPOS_X_'+String(i+1)+'"]').textContent);
         instantPrize_bg.y = instantTitleTxt.y+65;
         instantPrize_bg.anchor.set(0.5);
         instantPrize_bg.scale.x = 0.5;
         instantPrize_bg.scale.y = 0.5;
         this.game_container.add(instantPrize_bg);
         this.instantPrizeObjects[i] = {value:INSTANT_PRIZE[i],xPos:instantPrize_bg.x,yPos:instantPrize_bg.y,instantObj:instantPrize_bg};
     }    
};

game.prototype.addClimbingWall = function(){
    this.climbingWall = phaserGame.add.sprite(0,0,'climbing_wall');
    this.climbingWall.x =  this.lettersBg.x  - this.lettersBg.width/2- this.climbingWall.width/2-40;
    this.climbingWall.y =  540;//phaserGame.world.centerY;
    this.climbingWall.anchor.set(0.5);
    this.game_container.add(this.climbingWall);
    
    this.climbingPanel = phaserGame.add.sprite(0,0,'climbing_panel');
    this.climbingPanel.x = this.lettersBg.x  - this.lettersBg.width/2- this.climbingWall.width/2-40;
    this.climbingPanel.y = 540;//phaserGame.world.centerY;
    this.climbingPanel.anchor.set(0.5);    
    
    climbingPanelMask = _methodsConstants.drawRectangle(0,0XFF0000,this.climbingPanel.width,this.climbingPanel.height);
    climbingPanelMask.x = this.climbingWall.x-this.climbingPanel.width/2;
    climbingPanelMask.y = this.climbingWall.y-this.climbingPanel.height/2;
    climbingPanelMask.alpha = 0.5;
    this.game_container.add(climbingPanelMask);
    
    this.climbingWall.mask = climbingPanelMask;
    
    this.climbingMan = phaserGame.add.sprite(0,0,'climbing_man');
    this.climbingMan.x = this.climbingPanel.x+25; //105 65;
    this.climbingMan.y = this.climbingPanel.y+120;
    this.climbingMan.anchor.set(0.5);
    this.climbingMan.frame = 0;
    this.game_container.add(this.climbingMan);
    this.game_container.add(this.climbingPanel);
    
    this.climbingWall.y = this.climbingManPositions[this.clickCounts].wallY;
    //this.updateTheClimbingMan();
    this.updateTheClimbingMan("init");
};

game.prototype.addLetterBalls = function(){
    xPos = 490;
    yPos = 370;
    gap = 20;
    row = 7; //x axis
    column = 4; // y axis
    for(var i=0; i<column; i++){
        for(var j=0; j<row; j++){
            letterBalls = phaserGame.add.sprite(0,0,'ball');
            letterBalls.x =  xPos;
            letterBalls.y =  yPos;
            letterBalls.name = "ball_"+this.ballCount;
            letterBalls.anchor.set(0.5);
            
            ballMask = phaserGame.add.graphics(0,0);
            ballMask.beginFill(0xFF0000, 0.5);
            ballMask.drawCircle(100, 100, 95);
            ballMask.x =  xPos-100;
            ballMask.y =  yPos-60;
            ballMask.inputEnabled = true;
            ballMask.input.useHandCursor = true;
            ballMask.name = "ball_"+this.ballCount;
            ballMask.events.onInputDown.add(this.ballClicked, this);
            
            ALPHA_TXT_STYLE = {fill: '#FF0000',font:'65px Arial',align: 'right',wordWrap: true,fontWeight:'bold',wordWrapWidth: 150};
            alphaTxt = phaserGame.add.text(xPos, yPos, "88", ALPHA_TXT_STYLE);
            alphaTxt.x = alphaTxt.x+10;
            alphaTxt.y = alphaTxt.y+40;
            alphaTxt.anchor.set(0.5);
            alphaTxt.alpha = 0;
            alphaTxt.addColor("#ff0000", 0);
            this.letterBalls.push({ball:letterBalls,textObj:alphaTxt,ballMask:ballMask,opened:false});
            
            this.game_container.add(ballMask);
            this.game_container.add(letterBalls);
            this.game_container.add(alphaTxt);
            xPos = xPos+letterBalls.width+gap;
            letterBalls.mask = ballMask;
            this.ballCount++;
        }
        xPos = 490;
        yPos = yPos+letterBalls.height/2+gap;
    }
    //this.updateBallTexts();
};

game.prototype.addCountDown = function(){
    countDown_bg = phaserGame.add.sprite(0,0,'countDown_bg');
    countDown_bg.x =  phaserGame.world.centerX;
    countDown_bg.y =  phaserGame.world.centerY+325;
    countDown_bg.anchor.set(0.5);
    this.game_container.add(countDown_bg);
    
    GOESLEFT_TXT_STYLE = {fill: '#FFFFFF',font:'50px Arial',align: 'right',wordWrap: true,fontWeight:'bold',wordWrapWidth: 500};
    goesLeftTxt = phaserGame.add.text(0, 0, Preloader.goesLeft, GOESLEFT_TXT_STYLE);
    goesLeftTxt.x = countDown_bg.x - countDown_bg.width/2 - goesLeftTxt.width;
    goesLeftTxt.y = countDown_bg.y-20;
    this.game_container.add(goesLeftTxt);
    
    COUNTDOWN_TXT_STYLE = {fill: '#FFFFFF',font:'100px Arial',align: 'right',wordWrap: true,fontWeight:'bold',wordWrapWidth: 300};
    this.countDownTxt = phaserGame.add.text(0, 0, "0", COUNTDOWN_TXT_STYLE);
    this.countDownTxt.x = countDown_bg.x-this.countDownTxt.width/2;
    this.countDownTxt.y = countDown_bg.y-this.countDownTxt.height/2;
    this.game_container.add(this.countDownTxt);
    this.updateCountDown();
};

game.prototype.addPrizeWords = function(){    
    xpos = 1320;
    ypos = 255;
    firstPos = 0;
    for(var i=0; i<WORD_THEMES.length; i++){
        word = WORD_THEMES[i].ThemeWord.toUpperCase();
        this.gameWordObjects[i] = [{themeDetailId:Number(WORD_THEMES[i].ThemeDetailId),bgAndLetter:[]}];
        for(var j=0; j<word.length; j++){
            prizeWordBg = phaserGame.add.sprite(0,0,'prizeWord_bg');
            prizeWordBg.x =  xpos;
            prizeWordBg.y =  ypos;
            firstPos = (j === 0)? xpos :firstPos;
            prizeWordBg.anchor.set(0.5);
            prizeWordBg.scale.x = 0.5;
            prizeWordBg.scale.y = 0.5;
            
            PRIZELETTER_TXT_STYLE = {fill: '#FFFFFF',font:'35px Arial',align: 'right',wordWrap: true,fontWeight:'bold',wordWrapWidth: 300};
            prizeLetter = phaserGame.add.text(0, 0, word[j], PRIZELETTER_TXT_STYLE);
            prizeLetter.x = prizeWordBg.x-prizeLetter.width/2;
            prizeLetter.y = prizeWordBg.y-prizeLetter.height/2;
            
            this.game_container.add(prizeWordBg);
            this.game_container.add(prizeLetter);            
            this.gameWordObjects[i][0].bgAndLetter[j] = {wordBg:prizeWordBg,letter:prizeLetter};
            xpos = xpos+prizeWordBg.width/2+5;
        }
        xpos = firstPos+47.25;
        ypos = ypos+80;
    }
};

game.prototype.addPrizeValues = function(){
    //PRIZEVALUE_TXT_STYLE = {fill: '#D200FF',font:'35px Arial',align: 'center',wordWrap:false,fontWeight:'bold',wordWrapWidth: 300};
    PRIZEVALUE_TXT_STYLE = {fill: '#D200FF',font:Preloader.prizeValueFontSize+'px Arial',align: 'center',wordWrap:false,fontWeight:'bold',wordWrapWidth: 350};
    for(var i=0; i<PRIZE_VALUES.length; i++){
        prizeValuesTxt = phaserGame.add.text(0, 0, this.currencyId+PRIZE_VALUES[i], PRIZEVALUE_TXT_STYLE);
        prizeValuesTxt.anchor.set(0.5);
        prizeValuesTxt.x = 1780;
        prizeValuesTxt.y = this.gameWordObjects[i][0].bgAndLetter[0].wordBg.y;//+prizeValuesTxt.height;
        this.game_container.add(prizeValuesTxt);
        prizeValuesTxt.stroke = "#de77ae";
        prizeValuesTxt.strokeThickness = 16;
        prizeValuesTxt.setShadow(2, 2, "#333333", 2, true, false);
    };
    INSTANTVALUE_TXT_STYLE = {fill: '#D200FF',font:Preloader.instantPrizeFontSize+'px Arial',align: 'right',wordWrap: false,fontWeight:'bold',wordWrapWidth: 300};
    for(var i=0; i<this.instantPrizeObjects.length; i++){
        instantPrizeTxt = phaserGame.add.text(0, 0, this.currencyId+INSTANT_PRIZE[i], INSTANTVALUE_TXT_STYLE);
        //instantPrizeTxt = phaserGame.add.text(0, 0, "$100", INSTANTVALUE_TXT_STYLE);
        instantPrizeTxt.x = Number(Preloader.xml.querySelector('[id="INSTANTPRIZE_X_'+String(i+1)+'"]').textContent);//this.instantPrizeObjects[i].xPos-instantPrizeTxt.width-60;
        instantPrizeTxt.y = this.instantPrizeObjects[i].yPos-instantPrizeTxt.height/2;
        this.game_container.add(instantPrizeTxt);
        instantPrizeTxt.stroke = "#de77ae";
        instantPrizeTxt.strokeThickness = 16;
        instantPrizeTxt.setShadow(2, 2, "#333333", 2, true, false);
    };
};

game.prototype.ballClicked = function(aObject){
    this.disableTheBalls(false);
    this.clickCounts++;
    this.updateCountDown();
    this.selectedBallNum = Number(aObject.name.split("_")[1]);
    _sounds.playSound("click",1);
    //_webServiceHandler.buy(this.clickCounts,String(BALL_ALPHA_LETTERS[this.selectedBallNum]));
    _webServiceHandler.buy(this.clickCounts,String(BALL_ALPHA_LETTERS[this.clickCounts-1]),this.selectedBallNum);
};

game.prototype.updateThebuyResult = function(){
    this.updateTheUserClickedAnswer();
};

game.prototype.updateTheUserClickedAnswer = function(){
    (this.letterBalls[this.selectedBallNum] !== undefined) ? this.letterBalls[this.selectedBallNum].textObj.setText(BALL_ALPHA_LETTERS[this.clickCounts-1]) : "";
    obj = this.letterBalls[this.selectedBallNum].ball;
    textObj = this.letterBalls[this.selectedBallNum].textObj;
    this.letterBalls[this.selectedBallNum].opened = true;
    obj.animations.add('ballOpen' , [1,2,3,4,5],5 ,false);
    obj.animations.play('ballOpen');
    obj.events.onAnimationComplete.add(function(){_game.ballOpenAnimCompleted();}, this);
    if(CHARACTER_AND_POSITIONS !== ""){
        this.winCount++;
        isInstantPrize = this.checkTheInstantPrize(BALL_ALPHA_LETTERS[this.clickCounts-1]);
        if(isInstantPrize === true){
            textObj.addColor("#D200FF", 0);
            this.showInstantPrizeSymbol(obj,BALL_ALPHA_LETTERS[this.clickCounts-1]);
        } else {
            textObj.addColor("#00ff00", 0);
        }
        this.updateTheClimbingMan("moveForward");
        this.updateThePrizeValueLetters();
    }
    phaserGame.add.tween(textObj).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true);
    //phaserGame.time.events.add(Phaser.Timer.SECOND * 1000, _game.checkAndEnableTheAllBalls(), this);
};

game.prototype.ballOpenAnimCompleted = function(){
    (_footerPanel.isHelpPageShowing === false) ? _game.checkAndEnableTheAllBalls() : "";
};

game.prototype.checkTheInstantPrize = function(aVal){
    isInstantPrize = false;
    for(var i=0; i<INSTANT_PRIZE.length; i++){
        if(String(INSTANT_PRIZE[i]) === String(aVal)){
            isInstantPrize = true;
        }
    }
    return(isInstantPrize);
};

game.prototype.showInstantPrizeSymbol = function(aBallObj,aValue){
    instantPrizeSymbolSmall = phaserGame.add.sprite(0,0,'instantPrize');
    instantPrizeSymbolSmall.x =  aBallObj.x;
    instantPrizeSymbolSmall.y =  aBallObj.y+70;
    instantPrizeSymbolSmall.anchor.set(0.5);
    instantPrizeSymbolSmall.width =  0;
    instantPrizeSymbolSmall.height =  0;
    this.game_container.add(instantPrizeSymbolSmall);
    phaserGame.add.tween(instantPrizeSymbolSmall.scale).to( { x: 0.2, y: 0.2 }, 500, Phaser.Easing.Elastic.Out, true);
    this.instantPrizeSymbols.push(instantPrizeSymbolSmall);

    for(var i=0; i<this.instantPrizeObjects.length; i++){        
         if(String(this.instantPrizeObjects[i].value) === String(aValue)){
             instantPrizeSymbolbig = phaserGame.add.sprite(0,0,'instantPrize');
             instantPrizeSymbolbig.x =  this.instantPrizeObjects[i].xPos;
             instantPrizeSymbolbig.y =  this.instantPrizeObjects[i].yPos;
             instantPrizeSymbolbig.anchor.set(0.5);
             instantPrizeSymbolbig.width =  0;
             instantPrizeSymbolbig.height =  0;
             this.game_container.add(instantPrizeSymbolbig);
             this.instantPrizeSymbols.push(instantPrizeSymbolbig);
             phaserGame.add.tween(instantPrizeSymbolbig.scale).to( { x: 0.5, y: 0.5 }, 500, Phaser.Easing.Elastic.Out, true);
             break;
        }
    }
};

game.prototype.updateBallTexts = function(){
    for(var i=0; i<BALL_ALPHA_LETTERS.length; i++){
        (this.letterBalls[i] !== undefined) ? this.letterBalls[i].textObj.setText(BALL_ALPHA_LETTERS[i]) : "";
    }
};

game.prototype.updateTheClimbingMan = function(aManAnimation){
    switch(aManAnimation) {
        case "moveForward":
            phaserGame.add.tween(this.climbingWall).to( {y: this.climbingManPositions[this.winCount].wallY }, 100, Phaser.Easing.Normal, true);
            this.climbingMan.x = this.climbingManPositions[this.winCount].manX;
            this.climbingMan.y = this.climbingManPositions[this.winCount].manY;
            this.climbingMan.frame = (this.winCount === 0) ? 0 :(this.winCount % 2 === 1)? 1 : 2;
            _sounds.playSound("moveUp",1);
          break;
        case "win":
          // code block
          break;
        case "loss":
            phaserGame.add.tween(this.climbingWall).to( {y: this.climbingManPositions[0].wallY }, 500, Phaser.Easing.Elastic.Out, true);
            this.climbingMan.animations.add('ani' , [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,0],51 ,false);
            this.climbingMan.animations.play('ani');
            this.climbingMan.x = this.climbingManPositions[0].manX;
            this.climbingMan.y = this.climbingManPositions[0].manY;
        break;
        
        case "init":
            this.climbingWall.y = this.climbingManPositions[0].wallY;
            this.climbingMan.x = this.climbingManPositions[0].manX;
            this.climbingMan.y = this.climbingManPositions[0].manY;
            this.climbingMan.frame = 0;
            this.climbingMan.alpha = 1;
        break;
        default:
          // code block
      }
};

game.prototype.updateThePrizeValueLetters = function(){
    matchingChar = CHARACTER_AND_POSITIONS.split("|");
    for(var i=0; i<matchingChar.length; i++){
        themeId = matchingChar[i].split("~")[0];
        matchingLetters = matchingChar[i].split("~")[1];
        for(var k=0; k<this.gameWordObjects.length; k++){
            if(String(this.gameWordObjects[k][0].themeDetailId) === String(themeId)){
                lettersPosition = matchingLetters.split(",");
                for(var j=0; j<lettersPosition.length; j++){
                    this.gameWordObjects[k][0].bgAndLetter[lettersPosition[j]-1].letter.addColor("#00ff00", 0);
                }
                break;
            }
        }
    }
};

game.prototype.updateCountDown = function(){
    val = TOTAL_CLICKS - this.clickCounts;
    count = (val >9) ? val : String("0"+val);
    (this.countDownTxt !== undefined) ? this.countDownTxt.setText(count) : "";
};

game.prototype.updateTheInbetweenData = function(){
    this.disableTheBalls(false);
    selectedChar = SELECTED_CHARACTERS.split("|");
    for(var i=0; i<selectedChar.length; i++){
        //index = BALL_ALPHA_LETTERS.indexOf(selectedChar[i].split("~")[0]);
        index = Number(selectedChar[i].split("~")[1]);        
        availableLetter = Number(selectedChar[i].split("~")[2]);
        obj = this.letterBalls[index].ball;
        textObj = this.letterBalls[index].textObj;
        this.letterBalls[index].opened = true;
        (textObj !== undefined) ? textObj.setText(selectedChar[i].split("~")[0]) : "";
        obj.frame = 5;
        if(availableLetter === 1){
            this.winCount++;
            textObj.addColor("#00ff00", 0);
        }
        isInstantPrize = this.checkTheInstantPrize(BALL_ALPHA_LETTERS[index]);
        if(isInstantPrize === true){
            textObj.addColor("#D200FF", 0);
            this.showInstantPrizeSymbol(obj,BALL_ALPHA_LETTERS[index]);
        }
        textObj.alpha = 1;
    }   
    this.clickCounts = GOES_COUNT;
    this.updateCountDown();
    this.updateTheClimbingMan("moveForward");
    this.updateThePrizeValueLetters();    
};

game.prototype.showPopupForPreviousData = function(aMsg,aProps){
    _footerPanel.footerButtonsEnable(false);
    this.disableTheBalls(false);
    this.popupBg = new customizeHandler.Image(phaserGame.world.centerX,phaserGame.world.centerY,'popup_bg');
    this.popupBg.anchor.set(0.5);
    this.popupBg.width = 0;
    this.popupBg.height = 0;
    this.game_container.add(this.popupBg);

    POPUP_LABEL_STYLE = {fill: '#2912327',font:'50px '+INFOFONT,align: 'center',wordWrap: true,fontWeight:'bold',wordWrapWidth: 500};
    //this.previousGameAlertTxt = phaserGame.add.text(this.popupBg.x, this.popupBg.y-40, Preloader.previousGameAlertMsg, POPUP_LABEL_STYLE);
    this.previousGameAlertTxt = phaserGame.add.text(this.popupBg.x, this.popupBg.y-40, aMsg, POPUP_LABEL_STYLE);
    this.previousGameAlertTxt.anchor.set(0.5);
    this.previousGameAlertTxt.width = 0;
    this.previousGameAlertTxt.height = 0;
    this.game_container.add(this.previousGameAlertTxt);
    
    this.yes_btn = phaserGame.add.button(0,0,'yes_btn', this.popupYesNoClicked, this, 0, 0, 0, 0);
    this.yes_btn.anchor.set(0.5);
    this.yes_btn.name = "yes_"+aProps;
    this.yes_btn.input.useHandCursor = true;
    this.yes_btn.x = this.popupBg.x+95;
    this.yes_btn.y = this.popupBg.y+200;
    this.game_container.add(this.yes_btn);
    
    YES_LABEL_STYLE = {fill: '#01610B',font:'60px '+INFOFONT,align: 'center',wordWrap: true,fontWeight:'bold',wordWrapWidth: 100};
    this.yesTxt = phaserGame.add.text(this.yes_btn.x+10, this.yes_btn.y, Preloader.yesLabel, YES_LABEL_STYLE);
    this.yesTxt.anchor.set(0.5);
    this.yesTxt.width = 0;
    this.yesTxt.height = 0;
    this.game_container.add(this.yesTxt);    
    
    this.no_btn = phaserGame.add.button(0,0,'no_btn', this.popupYesNoClicked, this, 0, 0, 0, 0);
    this.no_btn.anchor.set(0.5);
    this.no_btn.name = "no_"+aProps;
    this.no_btn.input.useHandCursor = true;
    this.no_btn.x = this.yes_btn.x+250;
    this.no_btn.y = this.yes_btn.y;
    this.game_container.add(this.no_btn);
    
    NO_LABEL_STYLE = {fill: '#533502',font:'60px '+INFOFONT,align: 'center',wordWrap: true,fontWeight:'bold',wordWrapWidth: 100};
    this.noTxt = phaserGame.add.text(this.no_btn.x+10, this.no_btn.y, Preloader.noLabel, NO_LABEL_STYLE);
    this.noTxt.anchor.set(0.5);
    this.noTxt.width = 0;
    this.noTxt.height = 0;
    this.game_container.add(this.noTxt);
    
    popupBgTween = phaserGame.add.tween(this.popupBg.scale).to( { x: 1.30, y: 1.30 }, 500, Phaser.Easing.Elastic.Out, true);
    phaserGame.add.tween(this.yes_btn.scale).to( { x: 1.30, y: 1.30 }, 500, Phaser.Easing.Elastic.Out, true);
    phaserGame.add.tween(this.no_btn.scale).to( { x: 1.30, y: 1.30 }, 500, Phaser.Easing.Elastic.Out, true);
    phaserGame.add.tween(this.previousGameAlertTxt.scale).to( { x: 1.30, y: 1.30 }, 500, Phaser.Easing.Elastic.Out, true);
    phaserGame.add.tween(this.yesTxt.scale).to( { x: 1.30, y: 1.30 }, 500, Phaser.Easing.Elastic.Out, true);
    phaserGame.add.tween(this.noTxt.scale).to( { x: 1.30, y: 1.30 }, 500, Phaser.Easing.Elastic.Out, true);
};

game.prototype.popupYesNoClicked = function(aObject){
    this.removePopup();
    props = aObject.name.split("_");
    switch(props[1]) {
        case "previousGame":
            (props[0] === "yes") ? this.checkAndEnableTheAllBalls() : _webServiceHandler.callQuitTheGame();
        break;
        case "exit":
            this.checkAndEnableTheAllBalls();
            (props[0] === "no") ?  "" : window.close();
        break;
        default:
    }
    _footerPanel.footerButtonsEnable(true);
};

game.prototype.removePopup = function(){
    (this.popupBg !== undefined) ? this.popupBg.destroy() : "";
    (this.yes_btn !== undefined) ? this.yes_btn.destroy() : "";
    (this.no_btn !== undefined) ? this.no_btn.destroy() : "";
    (this.previousGameAlertTxt !== undefined) ? this.previousGameAlertTxt.destroy() : "";
    (this.yesTxt !== undefined) ? this.yesTxt.destroy() : "";
    (this.noTxt !== undefined) ? this.noTxt.destroy() : "";
};

game.prototype.showTheGameResult = function(){
    _footerPanel.footerButtonsEnable(false);
    
    this.backdrop = _methodsConstants.drawRectangle(0,0X000000,1920,1200);
    this.backdrop.alpha = 0;
    this.game_container.add(this.backdrop);
    phaserGame.add.tween(this.backdrop).to( { alpha: 0.5 }, 1000, "Linear", true);
    
    winLossBg = "";
    frames = 0;
    if(WIN_AMOUNT === 0 || WIN_AMOUNT === "0.00"){
        this.updateTheClimbingMan("loss");
        winLossBg = "youLoss_bg";
        _sounds.playSound("loss",1);
        frames = 31;
    } else {        
        winLossBg = "youWin_bg";
        _sounds.playSound("win",1);
        frames = 52;
    }
    this.climbingMan.alpha = 0;
    this.youWinLoss_bg = phaserGame.add.sprite(0,0,winLossBg);
    this.youWinLoss_bg.x = (phaserGame.world.centerX);
    this.youWinLoss_bg.y = (phaserGame.world.centerY);
    this.youWinLoss_bg.anchor.set(0.5);
    this.youWinLoss_bg.width = 0;
    this.youWinLoss_bg.height = 0;
    this.youWinLoss_bg.animations.add('youwinLossAni');
    this.youWinLoss_bg.animations.play('youwinLossAni', frames, false);
    youWinLoss_bgTween = phaserGame.add.tween(this.youWinLoss_bg.scale).to( { x: 2, y: 2 }, 1000, Phaser.Easing.Elastic.Out, true);
    youWinLoss_bgTween.onComplete.add(this.youWinLoss_bgTweenComplete, this);
    this.game_container.add(this.youWinLoss_bg);
};

game.prototype.youWinLoss_bgTweenComplete = function(){
    if(WIN_AMOUNT > 0){
        YOUWIN_TXT_STYLE = {fill: '#015A5C',font:'140px '+INFOFONT,align: 'center',wordWrap: true,fontWeight:'bold',wordWrapWidth: 150};
        this.winAmountTxt = phaserGame.add.text(0, 0, this.currencyId+WIN_AMOUNT, YOUWIN_TXT_STYLE);
        this.winAmountTxt.x = this.youWinLoss_bg.x;
        this.winAmountTxt.y = this.youWinLoss_bg.y+190;
        this.winAmountTxt.anchor.set(0.5);
        this.winAmountTxt.alpha = 0;
        this.game_container.add(this.winAmountTxt);
        phaserGame.add.tween(this.winAmountTxt).to({alpha: 1}, 1000, Phaser.Easing.Elastic.Out, true);
    }
    _footerPanel.updateTheCreditAmount(CREDIT_AMT);
    _footerPanel.updateTheWinningAmount(WINNING_AMT);
    _footerPanel.updateTheBetAmount(GAME_ENTRY_FEE);
    _footerPanel.updateTheWinAmount(WIN_AMOUNT);    
    this.playAgain_btn = phaserGame.add.button(0,0,'playAgain_btn', this.playAgainClick, this, 0, 0, 0, 0);
    this.playAgain_btn.x = (phaserGame.world.centerX);
    this.playAgain_btn.y = (phaserGame.world.centerY)+350;
    this.playAgain_btn.anchor.set(0.5);
    this.playAgain_btn.alpha = 0;
    this.playAgain_btn.input.useHandCursor = true;
    this.playAgain_btn.scale.x = 0.6;
    this.playAgain_btn.scale.y = 0.6;
    phaserGame.add.tween(this.playAgain_btn).to({alpha: 1}, 1000, Phaser.Easing.Elastic.Out, true);
    this.game_container.add(this.playAgain_btn);
    this.showYouWinExitBtn();
};

game.prototype.playAgainClick = function(aObj){
    aObj.input.enabled = false;
    aObj.input.useHandCursor = false;
    _webServiceHandler.callNewGame();
};

game.prototype.youWinexitTheGame = function(){    
    /*(this.playAgain_btn !== undefined) ? this.playAgain_btn.input.enabled = false : "";
    (this.playAgain_btn !== undefined) ? this.playAgain_btn.input.useHandCursor = false : "";
    (this.youWinexit_btn !== undefined) ? this.youWinexit_btn.input.enabled = false : "";
    (this.youWinexit_btn !== undefined) ? this.youWinexit_btn.input.useHandCursor = false : "";*/
    window.close();
};

game.prototype.showYouWinExitBtn = function(){
    this.youWinexit_btn = phaserGame.add.button(0,0,"exit_btn", this.youWinexitTheGame, this);
    this.youWinexit_btn.alpha = 0;
    this.youWinexit_btn.x = 1810;
    this.youWinexit_btn.y = 65;
    this.youWinexit_btn.anchor.set(0.5);    
    this.youWinexit_btn.input.useHandCursor = true;
    this.game_container.add(this.youWinexit_btn);
    phaserGame.add.tween(this.youWinexit_btn).to( { alpha: 1 }, 1000, "Linear", true);
};

game.prototype.playNewGame = function(){
    this.resetTheGame();    
    this.addLetterBalls();
    this.addPrizeWords();
    this.updateTheClimbingMan("init");
    this.updateCountDown();
    _footerPanel.updateTheCreditAmount(CREDIT_AMT);
    _footerPanel.updateTheWinningAmount(WINNING_AMT);
    _footerPanel.updateTheBetAmount(GAME_ENTRY_FEE);
    _footerPanel.updateTheWinAmount("0"); 
};

game.prototype.checkAndEnableTheAllBalls = function(){
    if(this.clickCounts < TOTAL_CLICKS){
        for(var i=0; i<this.letterBalls.length; i++){
            if(this.letterBalls[i].opened === false){
                this.letterBalls[i].ballMask.inputEnabled = true;
                this.letterBalls[i].ballMask.input.useHandCursor = true;
            }
        }
    } else {
        this.showTheGameResult();
    }
};

game.prototype.disableTheBalls = function(aBoolean){
    for(var i=0; i<this.letterBalls.length; i++){
        this.letterBalls[i].ballMask.inputEnabled = aBoolean;
        this.letterBalls[i].ballMask.input.useHandCursor = aBoolean;
    }
};

game.prototype.closeTheInfoBtn = function(){
    _footerPanel.footerClosed();
    this.checkAndEnableTheAllBalls();
};

game.prototype.resetTheGame = function(){
    _footerPanel.footerReset();
    for(var i=0; i<this.gameWordObjects.length; i++){
        this.gameWordObjects[i][0].themeDetailId = "";
        for(var j=0; j<this.gameWordObjects[i][0].bgAndLetter.length; j++){
            this.gameWordObjects[i][0].bgAndLetter[j].wordBg.destroy();
            this.gameWordObjects[i][0].bgAndLetter[j].letter.destroy();
            this.gameWordObjects[i][0].bgAndLetter[j].length = 0;
        }
    }
    for(var i=0; i<this.letterBalls.length; i++){
        this.letterBalls[i].ball.destroy();
        this.letterBalls[i].textObj.destroy();
        this.letterBalls[i].ballMask.destroy();
    }
    for(var i=0; i<this.instantPrizeSymbols.length; i++){
        (this.instantPrizeSymbols[i] !== undefined) ? this.instantPrizeSymbols[i].destroy() : "";
    }
    this.clickCounts = 0;
    this.winCount = 0;
    this.ballCount = 0;
    this.gameWordObjects.length = 0;
    this.gameWordObjects = [];
    this.letterBalls.length = 0;
    this.letterBalls = [];
    this.instantPrizeSymbols.length = 0;
    this.instantPrizeSymbols = [];
    this.selectedBallNum = -1;
    (this.youWinLoss_bg !== undefined) ? this.youWinLoss_bg.destroy() : "";
    (this.winAmountTxt !== undefined) ? this.winAmountTxt.destroy() : "";
    (this.playAgain_btn !== undefined) ? this.playAgain_btn.destroy() : "";
    (this.backdrop !== undefined) ? this.backdrop.destroy() : "";
    (this.youWinexit_btn !== undefined) ? this.youWinexit_btn.destroy() : "";
};
