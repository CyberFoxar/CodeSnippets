// ==UserScript==
// @name         Bandcamp Volume Bar
// @version      2.2
// @description  adds a volume bar to Bandcamp
// @author       @HiImBlu, CyberFoxar
// @match        *://*.bandcamp.com/*
// @match        *lapfoxtrax.com/*
// @exclude      *://bandcamp.com/
// @grant        GM_addStyle
// @downloadURL https://github.com/CyberFoxar/CodeSnippets/raw/master/JS/userscripts/Bandcamp%20Volume%20Bar.user.js
// @updateURL https://github.com/CyberFoxar/CodeSnippets/raw/master/JS/userscripts/Bandcamp%20Volume%20Bar.user.js
// @namespace cyberfoxar.tk
// ==/UserScript==

//Build the stuff !
document
  .querySelectorAll("audio")
  .forEach(el => el.classList.add("audioSource"));
const volumeControl = htmlToElement("<div class='volumeControl'></div>");
const player = document.querySelector(".inline_player");
player.after(volumeControl);

document
  .querySelector(".volumeControl")
  .append(htmlToElement("<div class='speaker'></div>"));
document
  .querySelector(".volumeControl")
  .append(htmlToElement("<div class='volume'></div>"));
document
  .querySelector(".volume")
  .append(htmlToElement("<span class='volumeInner'></span>"));

// $("audio").attr("id", "audioSource");
// $("<div class='volumeControl'></div>").insertAfter(".inline_player");
// $(".volumeControl").append("<div class='speaker'></div>");
// $(".volumeControl").append("<div class='volume'></div>");
// $(".volume").append("<span class='volumeInner'></span>");

//CSS Time!
let percentage = 75; // will be reassigned
const speakerurl = "http://i.imgur.com/hRWrLHJ.png";
const muteurl = "http://i.imgur.com/5mxvYNN.png";
const css =
  ".volumeControl { margin-bottom: 10px; }" +
  ".speaker {" +
  "position: relative;" +
  "width: 50px;" +
  "height: 50px;" +
  "background: url('" +
  speakerurl +
  "') rgba(2,2,2,.1) 50% 50% no-repeat;" +
  "border-radius: 3px;" +
  "cursor: pointer;" +
  "}" +
  ".volumeInner {" +
  "position: absolute;" +
  "bottom: 0;" +
  "width: " +
  percentage +
  "%;" +
  "height: 20px;" +
  "background-color: #fff;" +
  "}" +
  ".volume {" +
  "position: relative;" +
  "width: 80%;" +
  "height: 20px;" +
  "margin-top: -35px;" +
  "float: right;" +
  "cursor: pointer;" +
  "background-color: rgba(2,2,2,.1);" +
  "border: 1px solid rgba(190,190,190,.5);" +
  "}";
GM_addStyle(css);

//Sexy Script!
const source = document.querySelector(".audioSource");
const volume = document.querySelector(".volume");
const body = document.body;
const speaker = document.querySelector(".speaker");
const volumeInner = document.querySelector(".volumeInner");

source.volume = percentage / 100;

function changeVolume(e) {
  const clickPos = e.offsetX // e.pageX - volume.offsetLeft; // $(".volume").offset().left;
  const maxWidth = volume.clientWidth; //$(".volume").width();
  percentage = Math.floor((clickPos / maxWidth) * 100);
  if (percentage > 100) {
    percentage = 100;
    // $(".volumeInner").css("width", "100%");
    volumeInner.style.width = "100%";
  } else if (percentage < 0) {
    percentage = 0;
    // $(".volumeInner").css("width", "0%");
    volumeInner.style.width = "0%";
  } else {
    // $(".volumeInner").css("width", percentage + "%");
    volumeInner.style.width = percentage + "%";
  }

  source.volume = percentage / 100;
}

// $(".volume").mousedown(
volume.addEventListener("mousedown", function(e) {
  console.log("volume bar clicked");
  changeVolume(e);
  /* $("body").css({
    "-webkit-user-select": "none",
    "-moz-user-select": "none"
  }); */
  body.addEventListener("mousemove", changeVolume(e));
  /* $("body").mousemove(function(e) {
    changeVolume(e);
  }); */
});

//$(document).mouseup(
document.addEventListener("mouseup", function() {
  body.removeEventListener("mousemove", changeVolume);
  /*
  $("body").off("mousemove");
  $("body").css({
    "-webkit-user-select": "all",
    "-moz-user-select": "all"
  }); */
});

let mute = false;
// $(".speaker").click(
speaker.addEventListener("click", function() {
  if (mute) {
    mute = false;
    // $(".speaker").css("background-image", "url('" + speakerurl + "')");
    speaker.style.backgroundImage = "url('" + speakerurl + "')";
    //$(".volumeInner").css("width", percentage + "%");
    volumeInner.style.width = percentage + "%";
    source.volume = percentage / 100;
  } else {
    mute = true;
    // $(".speaker").css("background-image", "url('" + muteurl + "')");
    speaker.style.backgroundImage = "url('" + muteurl + "')";
    source.volume = 0;
    //$(".volumeInner").css("width", "0%");
    volumeInner.style.width = "0%"
  }
});

// Awesome tools !
/**
 * Returns a valid HTML element from a string.
 * HTML5+ compatible only.
 * from : https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
  const template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}
