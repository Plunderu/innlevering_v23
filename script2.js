// Brettet: 
let feltStr = 32;
let rader = 16; 
let kolonner = 16; 

//Definerer størrelsen på brettet 
let brettBredde = feltStr*kolonner // 32*16
let brettHoyde = feltStr*rader // 32*16

let context;  // bruk av context må skjønnes 

// lager knapper:
let restartBtn = document.querySelector("#restart")

// Lager objekt for forsvar
let forsvar = {
    x : feltStr * kolonner/2- feltStr,
    y : feltStr * rader - feltStr*2, 
    v : feltStr,
    bredde : feltStr * 2,
    hoyde : feltStr,
    bilde : new Image()
}

// blokk1 
let blokk1 = {
    x : 3*feltStr,
    y : brettHoyde/2,
    bredde : feltStr*3,
    hoyde : feltStr,
}

let blokk2 = {
    x : brettBredde - 6*feltStr,
    y : brettHoyde/2,
    bredde : feltStr*3,
    hoyde : feltStr,
}

let odelagt = false //Variabel som sjekker om blokkene treffes av angrep

// Angrep
let angrepArr = [];
let angriperSkuddArr = []
let angriperDreptArr = []
let angrepK = 3
let angrepR = 2
let angriperFart = 6

let bombeArr = []
let bombeV = -4

let angriperSkuddv = 3

// Skudd
let skuddArr = [];
let skuddV = -10
let antallSkudd = 0

// Poeng: 
let poeng = 0 
let gameOver = false




function lagAngrep(){
    for (let c = 0; c < angrepK; c++){
         for( let r = 0; r < angrepR; r++){
              let angriper = {
                bredde : feltStr*2,
                hoyde : feltStr,
                x : feltStr + c*feltStr*2,
                y : feltStr + r*feltStr,
                levende : true,
                bilde : new Image(),
                antall: 0
             } 

             angriper.bilde.src = "https://raw.githubusercontent.com/ImKennyYip/space-invaders/master/alien-magenta.png"
 
             angrepArr.push(angriper)
             angriper.antall = angrepArr.length

         }
 
     }
}


//Når nettsiden laster inn skal brettet tegnes
window.onload = function(){
    brett = document.getElementById("brett");
    brett.width = brettBredde;
    brett.height = brettHoyde;
    context = brett.getContext("2d"); //Dette brukes for å tegne på brettet

    //Setter bildet til forsvar
    forsvar.bilde.src = "https://www.pngall.com/wp-content/uploads/13/Space-Invaders-Ship.png"
    context.drawImage(forsvar.bilde, forsvar.x,forsvar.y,forsvar.bredde,forsvar.hoyde)

     //lagAngrep()
     lagAngrep()
       
    // Setter nettsiden til å oppdatere for å lage en animasjon 
   /*  requestAnimationFrame(oppdater) */

    addEventListener("keydown", flyttForsvar)

    addEventListener("keyup",skyt) // Forskjellen på keyup og keydown er at man må slippe også, kan ikke skyte automatisk 

    addEventListener("click", restart)

    setInterval(oppdater, 1000/50)

}


setInterval(angrepSkudd,500) // skjer en gang i sekundet


// Lager en uendelig loop med oppateringer (animasjon)
function oppdater(){

    // for å vise at den kjøres hele tiden 
    // console.log("oppdateres")
/*     if(!gameOver){ 
    requestAnimationFrame(oppdater)
    }

    else{
        requestAnimationFrame(ferdig)
    } */



    context.clearRect(0,0,brett.width, brett.height) // Klarerer lerretet for hver gang 

        // Tegner blokk så lenge de ikke er truffet av angrep 
        if(!odelagt){
            context.fillStyle = "blue"
            context.fillRect(blokk1.x ,blokk1.y,blokk1.bredde,blokk1.hoyde)
            context.fillRect(blokk2.x ,blokk2.y,blokk2.bredde,blokk2.hoyde)
        }

        
        // Sjekker om noen av angriperne treffer blokkade og fjerner den 
        for(let i = 0; i < angrepArr.length; i++){
            let angriper = angrepArr[i]
             if(kollisjon(blokk1,angriper)){
                odelagt = true
            }
            if(kollisjon(blokk2,angriper)){
                odelagt = true
            } 
        }
       

        

    //Oppdaterer bildet til forsvar
    context.drawImage(forsvar.bilde, forsvar.x, forsvar.y,forsvar.bredde,forsvar.hoyde) 
    
    let kollisjonVegg = false
 
     for(let i = 0; i < angrepArr.length; i++){
        let angriper = angrepArr[i];

        if (angriper.x + angriper.bredde >= brett.width || angriper.x <= 0) {
            kollisjonVegg = true 
        }
    }

    if (kollisjonVegg){
        angriperFart *= -1
    }
    // Oppdaterer posisjonen til angriper + flytter rad nærmere
    for(let i = 0; i < angrepArr.length; i++){
        let angriper = angrepArr[i]
        angriper.x += angriperFart

        if(kollisjonVegg){
            angriper.y += angriper.hoyde
        }


        context.drawImage(angriper.bilde, angriper.x,angriper.y,angriper.bredde,angriper.hoyde)
    }

        // Kuler fra forsvar
        for (let i = 0; i< skuddArr.length; i++){
            let skudd = skuddArr[i];
                skudd.y += skuddV; 
            context.fillStyle= "white";
            context.fillRect(skudd.x,skudd.y,skudd.bredde,skudd.hoyde)

        for (let i = 0; i < bombeArr.length; i++){
            let bombe = bombeArr[i];
                bombe.y += bombeV; 
                context.fillStyle= "white";
                context.fillRect(bombe.x,bombe.y,bombe.bredde,bombe.hoyde)
            }


            // Kulenes kollisjon med angrep 

            for (let j = 0; j < angrepArr.length; j++){
               let angriper = angrepArr[j];
                if(!skudd.brukt && angriper.levende && kollisjon(skudd, angriper)){
                    skudd.brukt = true
                    angriper.levende = false
                    angrepArr.splice(j, 1) // fjerner elemetet som blir skutt 
                    angriper.antall -= 1
                    poeng += 100
                    angriperDreptArr.push(1)
                    let treffLyd = new Audio("kjoh.mp3")
                    treffLyd.play()
                }
            }
            for(let i = 0; i< skuddArr.length; i++){
                let skudd = skuddArr[i]
                if(!odelagt && kollisjon(skudd,blokk1) || !odelagt && kollisjon(skudd,blokk2)){
                    skuddV *= -1 
                }
                if(skudd.y > brettHoyde){ //Dersom skuddet truffet blokkade ikke treffer forsvarer resettes skuddv 
                    skudd.brukt = true
                    skuddV *= -1
                }
                if(kollisjon(skudd,forsvar) && skuddV>0){
                    skudd.brukt = true // Fjerner skuddet etter kollisjon 
                    gameOver = true 
                }
            }

          
        }

                // Kuler fra angrep 
                for (let i = 0; i < angriperSkuddArr.length; i++){
                    let angriperSkudd = angriperSkuddArr[i];
                    if(gameOver === false && !angriperSkudd.brukt){                    
                    angriperSkudd.y += angriperSkuddv; 
                    context.fillStyle= "white";
                    context.fillRect(angriperSkudd.x,angriperSkudd.y,angriperSkudd.bredde,angriperSkudd.hoyde)}

                    if(!odelagt && kollisjon(angriperSkudd,blokk1) || !odelagt && kollisjon(angriperSkudd, blokk2)){
                        angriperSkudd.brukt = true
                    }

                }

                // Sjekker om angrep treffer forsvarer
                for(let i = 0; i< angriperSkuddArr.length; i++){
                    let angriperSkudd = angriperSkuddArr[i]
                    if(kollisjon(angriperSkudd,forsvar)){
                        gameOver = true
                    }

                }

    

        // Fjerner kulene etter at de er blitt brukt 
        while(skuddArr.length > 0 && (skuddArr[0]. brukt || skuddArr[0].y < 0)){
           skuddArr.shift() //Fjerner det første elementet i arrayet.  
        }

         // Fjerner kulene etter at de er blitt brukt 
        while(angriperSkuddArr.length > 0 && (angriperSkuddArr[0].brukt || angriperSkuddArr[0].y > brettHoyde)){
                    angriperSkuddArr.shift() //Fjerner det første elementet i arrayet.  
                 }
         
            //nytt level
        if(angrepArr.length == 0){   
            angrepK = angrepK + 1; //Dette må forstås, gjøres for at det angrepet ikke skal gå utenfor lerret. maks antall blir 16/2-2 = 6
            angrepR = angrepR + 1 // Maks rader blir 16-4
            angrepArr = [] // tømmer angrepArr
            skuddArr = [] //tømmer skuddArr hvorfor
            lagAngrep()
        }

        // Poeng 
        context.fillstyle = "white"
        context.font = "16px courier" 
        context.fillText(poeng, 5,20) 

        // Sjekker om angrepet treffer forsvarer og endrer til gameover: 
        for(let i = 0; i<angrepArr.length;i++)
            angriper = angrepArr[i]
        if(angriper.y >= forsvar.y ){
            gameOver = true
        }

   /*      if(gameOver){
            ferdig()
        } */
        end()
    
    }  

    function end (){
        if(gameOver){
            gameOverScreen()
        }
    }




// funksjon som flytter forsvaret
function flyttForsvar(e){
/*    if(gameOver){
        ferdig()        
}
     */
    if(e.code == "ArrowLeft" && forsvar.x - forsvar.v >= 0){
        forsvar.x  -= forsvar.v

    }
    else if(e.code == "ArrowRight" && forsvar.x + forsvar.v + forsvar.bredde <= brett.width){
        forsvar.x = forsvar.x + forsvar.v
    }
}



function skyt(e){
/*      if(gameOver){
        ferdig()
    }  */
    if (e.code == "Space"){
        let skudd ={
            x : forsvar.x + forsvar.bredde*15/32, //hvorfor 
            y : forsvar.y,
            v : skuddV,
            bredde : feltStr/8,
            hoyde : feltStr/2,
            brukt : false // sjekker om kula treffer angrep
        }
        let skytLyd = new Audio("pew.mp3")
        skytLyd.play()
 
        skuddArr.push(skudd)
    }

    if(e.code == "Enter" && angriperDreptArr.length >= 5){
            let bombe = {
                x : forsvar.x + forsvar.bredde*15/32, //hvorfor 
                y : forsvar.y,
                bredde : feltStr/2,
                hoyde : feltStr/2,
                brukt : false // sjekker om kula treffer angrep
            }
            console.log("Kjøh")
            bombeArr.push(bombe)
            angriperDreptArr= []
        }
    }


/* function bombe(e){
    if (e.code == "Enter"){
        let bombe = {
            x : forsvar.x + forsvar.bredde*15/32, //hvorfor 
            y : forsvar.y,
            bredde : feltStr/2,
            hoyde : feltStr/2,
            brukt : false // sjekker om kula treffer angrep
        }
        bombeArr.push(bombe)
    }
} */

function angrepSkudd(){  
        let tilfeldig = Math.floor(Math.random()*angrepArr.length) 
        let angriperSkudd ={
        x : angrepArr[tilfeldig].x + forsvar.bredde*15/32,
        y : angrepArr[tilfeldig].y,
        bredde : feltStr/8,
        hoyde : feltStr/2,
        brukt : false
    }
    angriperSkuddArr.push(angriperSkudd)

}


function kollisjon(a,b){
    return a.x < b.x + b.bredde && // øverste venstre hjørne til a treffer ikke øverste høyre hjørne i b 
    a.x + a.bredde > b.x && // øverste høyrne hjørne i a går forbi øverste venstre hjørne b 
    a.y < b.y + b.hoyde && // as øverste venstre hjørne når ikke bs nederste venstre hjørne 
    a.y + a.hoyde > b.y;// as nedre venstree hjørne går forbi bs nedre venstre hjørne 

}

function gameOverScreen(){
    //fyll skjermen svart
    context.fillStyle = "#000000";
    context.fillRect(0,0,brett.width,brett.height)
    //game over 
    context.font = "50px Courier";
    context.fillStyle = "#FFFFFF"
    context.fillText("GAME OVER", brett.width/2 - 150, brett.height/2)
    context.font = "30px Courier"
    context.fillText(`DIN SCORE BLE: ${poeng}`, brett.width/2 - 125, brett.height/2 + 50)
   }
/* 
function ferdig(){
    context.clearRect(0,0,brett.width, brett.height) 
    context.fillStyle = "#FFFFFF"
    context.font = "100px courier"
    context.fillText =("Gameover",300,300)
    removeEventListener("keydown", flyttForsvar)
    removeEventListener("keyup",skyt)
    angriperFart = 0 
}
 */

function restart(){
    console.log()
    window.onload
}