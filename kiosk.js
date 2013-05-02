function writeGooglePlusEvents(data, elem)
{
  var ghtml = "";
  for (var i=0; i< data.items.length; i++)
  {
    var item = data.items[i];
    var noteobj = item.object;
    var attach = noteobj.attachments;
    var notetxt = noteobj.content;
    var noteimgs = new Array();
    if (attach)
    {
      for (var a=0; a<attach.length; a++)
      {
        if ( attach[a].objectType == "album")
        {
          for (var t=0; t<attach[a].thumbnails.length; t++)
          {
            noteimgs.push(attach[a].thumbnails[t].image.url);
          }
        }
        else if ( attach[a].objectType == "photo")
        {
          noteimgs.push(attach[a].image.url);
        }
        else if (attach[a].objectType == "event")
        {
          notetxt = "<b>" + attach[a].displayName+"</b><br/>"+notetxt;
        }
      }
    }
    ghtml += '<div class="gpluspost">'
    ghtml += '<img class="gplusactor" src="'+item.actor.image.url+'"/><p class="gplustimestamp">'+item.updated.substring(0,16).replace("T"," ")+'</p>';
    ghtml += '<p class="gplustxt">'+notetxt+'</p>';
    if (noteimgs.length>0)
    {
      ghtml += '<table class="gplusimg" cellspacing="0"><tr>';
      for (var ni=0; ni<noteimgs.length; ni++)
      {
        ghtml += '<td><img class="gplusimg" src="'+noteimgs[ni]+'"/></td>';
      }
      ghtml += '</tr></table>';
    }
    ghtml += '</div>';
  }
  elem.innerHTML=ghtml;
}


function loadGooglePlusEvents()
{
  var gpak = "AIzaSyD9xBFM-KWwSYBgZ8VzftJ5wYYvurOxEHg";
  var gplusuri = "https://www.googleapis.com/plus/v1/people/113737596421797426873/activities/public?maxResults=4&key="+gpak;
  var gpluscontainer=document.getElementById("gplusevents");
  $.getJSON(gplusuri, function(data){
    writeGooglePlusEvents(data, gpluscontainer);
  });
}

function weekday2str(dow)
{
    var weekday=new Array(7);
    weekday[0]="So";
    weekday[1]="Mo";
    weekday[2]="Di";
    weekday[3]="Mi";
    weekday[4]="Do";
    weekday[5]="Fr";
    weekday[6]="Sa";
    weekday[7]="So";
    if (dow >=0 && dow <=7)
        return weekday[dow];
    else
        return "";
}

function writeCalendar(data, elem)
{
    var calhtml = "";
    for (var s=0; s<data.length; s++)
    {
      var when = "";
      var dt = Date.parse(data[s].start+'T'+data[s].starttime);
      if (Date.now() > dt)
      {
        when = "JETZT";
      }
      else
      {
        var weekday = weekday2str((new Date(dt)).getDay());
        var stime = data[s].starttime;
        var month = data[s].start.substring(5,7);
        if (month[0] == '0')
          month = month[1];
        var dayofmonth = data[s].start.substring(8,10);
          if (dayofmonth[0] == '0')
          dayofmonth = dayofmonth[1];
        while (stime.substring(stime.length-3,stime.length) == ":00")
        {
          stime=stime.substring(0,stime.length-3);
        }
        if (stime.length <= 2) { stime+="h"; }
        when = weekday + " " + dayofmonth+"."+month +", "+stime;
      }
      calhtml += '<li class="level1">'+when+' - <span class="r3red">'+data[s].title+'</span></li>'+"\n";
    }
    elem.innerHTML='<ul>'+calhtml+'</ul>';
}
function loadCalendar()
{
  //old URI: //grical.realraum.at/s/?query=!realraum&limit=9&view=json
  var calcontainer=document.getElementById("grical_upcoming");
  $.getJSON('/shmcache/grical_realraum.json', function(data){
    writeCalendar(data, calcontainer);
  });
}

function writeAnwesenheitStatus(data)
{
  var html="";
  var sensorshtml="";
  var sensorstd="";
  if (data.open)
  {
   iconuri=data.icon.open;
   statuscolor="lime";
  }
  else
  {
   iconuri=data.icon.closed;
   statuscolor="red";
  }
  html='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100"><tr><td style="width:100px;"><img style="float:left;" src="'+iconuri+'" height="100" width="100"/></td><td style="width:4px;"></td><td class="anwesenheitsstatus" style="background-color:'+statuscolor+'; ">'+data.status+'</td></tr></table>';
  document.getElementById('anwesenheit_status').innerHTML=html;

  if (data.sensors)
  {
    for (var s=0; s<data.sensors.length;s++)
    {
      $.each( data.sensors[s], function(stype, std){
        $.each( std, function(swhere, svalue){
           sensorstd+='<td class="sensorstatus"><b>'+stype+'</b><br/>'+swhere+': '+svalue+'</td>';
        });
      });
    }
  }
  if (sensorstd != "")
  {
    sensorshtml='<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>'+sensorstd+'</tr></table>';
    document.getElementById('sensor_status').innerHTML=sensorshtml;
  }
}

function updateAnwesenheitStatus()
{
 //var req = new XMLHttpRequest();
 url = "/status.json";
 //req.open("GET", url ,false);
 //google chrome workaround
 //req.setRequestHeader("googlechromefix","");
 //req.send(null);
 var jqxhr = $.getJSON(url, writeAnwesenheitStatus);
}

$(document).ready(function()
{
  updateDateClock(new Date());
  setInterval("clock()", 500);
  updateAnwesenheitStatus();
  loadCalendar();
  loadGooglePlusEvents();
  setInterval("updateAnwesenheitStatus()", 10*1000);
  setInterval("loadCalendar()", 123*1000);
  //setInterval("updateSensors()",145*1000);
  setInterval("updateSensors()",1000);
  setInterval("loadGooglePlusEvents()", 1207*1000);
});

function updateDateClock(now)
{
  var daynames = new Array('So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa');
  var datetimestr = daynames[now.getDay()];
  datetimestr += ' ' + now.getDate();
  datetimestr += '.' + (now.getMonth() + 1);
  datetimestr += '.' + now.getFullYear();
  datetimestr += (now.getHours() > 9 ? ' ' : ' 0') + now.getHours();
  datetimestr += (now.getMinutes() > 9 ? ':' : ':0') + now.getMinutes();
  datetimestr += (now.getSeconds() > 9 ? ':' : ':0') + now.getSeconds();
  $('#dateclock').html(datetimestr);
}

function highlightEntry(idx, color, value)
{
  if(value == 0) {
    if(idx%2 == 0)
      $('#upnext' + idx).css('background-color', 'white');
    else 
      $('#upnext' + idx).css('background-color', '#E0E0E0');
  } else {
    $('#upnext' + idx).css('background-color', color);
  }
}

var seconds = 0;
function clock(now)
{
  var now = new Date(new Date().valueOf() + 300);
  updateDateClock(now);
  seconds++;
  if(seconds >= 20) {
    seconds = 0;
  }
}

function showError(XMLHttpRequest, textStatus, errorThrown)
{
  alert("Error: " + textStatus);
}

function updateSensors()
{
  reloadImg(document.getElementById("tempsensor"));
  reloadImg(document.getElementById("movementsensor"));
  reloadImg(document.getElementById("lightsensor"));
}

function IsImageOk(img) {
    if (!img.complete)
    {
        return false;
    }
    if (typeof img.naturalWidth == "undefined" || (typeof img.naturalWidth == "number" && img.naturalWidth == 0))
    {
        return false;
    }
    return true;
}

var img_orig_src = {};
function reloadImgAlt(element)
{
    if(element.complete)
    {
      var new_image = new Image();
      //set up the new image
      new_image.id = element.id;
      new_image.className = element.className;
      if (! img_orig_src[element.id])
      {
        img_orig_src[element.id] = element.src;
      }
      new_image.src = img_orig_src[element.id] + "?dt="+Math.floor(new Date().getTime() / 1000).toString();
      if (IsImageOk(new_image))
      {
        element.parentNode.insertBefore(new_image,element);
        element.parentNode.removeChild(element);
      }
    }
}
function reloadImg(element)
{
    if (! img_orig_src[element.id])
    {
      img_orig_src[element.id] = element.src;
    }
    element.src = img_orig_src[element.id] + "?dt="+Math.floor(new Date().getTime() / 1000).toString();
}
