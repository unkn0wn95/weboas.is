document.addEventListener("DOMContentLoaded",init);function init(){loadScript("https://ufile.io/assets/js/dropzone.js",function(){Dropzone.autoDiscover=false;user_id=window.uploadfilesSettings.user_id||null;auth_key=window.uploadfilesSettings.auth_key||null;folder_id=window.uploadfilesSettings.folder_id||null;show_expiry=window.uploadfilesSettings.show_expiry||false;default_expiry=window.uploadfilesSettings.default_expiry||false;widget_message=window.uploadfilesSettings.widget_message||"Drop file here or click to upload"
private=window.uploadfilesSettings.private||0;secure=window.uploadfilesSettings.secure||0;expiryFormAdded=false;max_files=window.uploadfilesSettings.max_files||1;if(max_files>99)
{max_files=99;}
max_file_size=window.uploadfilesSettings.max_file_size||50000;if(max_file_size>50000)
{max_file_size=50000;}
if(private)
{slug_length=15;}
else
{slug_length=8;}
var dropzone=new Dropzone('#uf-dropzone',{url:"https://up.ufile.io/v1/upload/chunk",autoProcessQueue:false,maxFiles:max_files,maxFilesize:max_file_size,dictDefaultMessage:widget_message,params:function(files,xhr,chunk){if(chunk)
{return{chunk_index:chunk.index+1};}},chunksUploaded:function(file,done){var formData=new FormData();formData.append('fuid',file.fuid);formData.append('file_name',file.name);formData.append('file_type',file.name.substr((file.name.lastIndexOf('.')+1)));formData.append('total_chunks',file.upload.totalChunkCount);formData.append('folder_id',folder_id);formData.append('slug_length',slug_length);formData.append('private',private);formData.append('secure',secure);formData.append('default_expiry',default_expiry);formData.append('widget',true);var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(){if(this.readyState==4)
{done();var data=this.responseText;data=JSON.parse(data);if(data.slug){window.slug=window.slug||[];window.slug.push(data.slug);if(typeof uploadComplete=='function')
{uploadComplete(this.response);}
if(show_expiry&&expiryFormAdded===false)
{enableExpiry();}}else{dropzone._errorProcessing([file],data.message,true);}}}
var finalBaseUrl=file.storageBaseUrl?file.storageBaseUrl+'v1/upload/finalise':'https://up.ufile.io/v1/upload/finalise';xhr.open("POST",finalBaseUrl,true);xhr.withCredentials=true;xhr.send(formData);},});dropzone.on("addedfiles",function(files){count=0;uploadQueue=files;totalFiles=uploadQueue.length;if(totalFiles)
{create_session(uploadQueue[count]);}});dropzone.on("sending",function(file,xhr,formData){formData.append('fuid',file.fuid);});dropzone.on("complete",function(file){if(file.status=="success")
{count++;setTimeout(function(){if(count<totalFiles)
{create_session(uploadQueue[count]);}},500);}});dropzone.on("queuecomplete",function(){if(show_expiry&&expiryFormAdded===false){enableExpiry();}});function create_session(file)
{var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(){if(this.readyState!==4)return;var response=JSON.parse(this.responseText);if(typeof(response)==="object"){if(response&&response.error===''){runSessionRequest(response);}else{runSessionRequest({});}}
else{console.warn(response);dropzone._errorProcessing([file],response,true);}}
var formData=new FormData();formData.append("user_id",user_id);formData.append("auth_key",auth_key);xhr.open("POST","https://ufile.io/v1/upload/select_storage",true);xhr.withCredentials=true;xhr.send(formData)
var runSessionRequest=function(requestParams){var url='https://up.ufile.io/v1/upload/create_widget_session';var uploadUrl='';if(requestParams&&requestParams.storageBaseUrl){url=requestParams.storageBaseUrl+'v1/upload/create_widget_session';uploadUrl=requestParams.storageBaseUrl+'/v1/upload/chunk';}
var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(){if(this.readyState==4)
{response=JSON.parse(this.responseText);if(typeof(response)=="object")
{if(response.fuid)
{file.fuid=response.fuid;if(uploadUrl!==''){dropzone.options.url=uploadUrl;file.storageBaseUrl=requestParams.storageBaseUrl;}
dropzone.processFile(file);}
else
{console.warn(response.message);dropzone._errorProcessing([file],response.message,true);}}
else
{console.warn(response);dropzone._errorProcessing([file],response,true);}}}
var formData=new FormData();formData.append("user_id",user_id);formData.append("auth_key",auth_key);formData.append("file_size",file.size);xhr.open("POST",url,true);xhr.withCredentials=true;xhr.send(formData);};}});}
function loadScript(url,callback){var script=document.createElement("script")
script.type="text/javascript";if(script.readyState){script.onreadystatechange=function(){if(script.readyState=="loaded"||script.readyState=="complete"){script.onreadystatechange=null;callback();}};}else{script.onload=function(){callback();};}
script.src=url;document.getElementsByTagName("head")[0].appendChild(script);}
function chunksComplete(responseText){data=JSON.parse(responseText);window.slug=window.slug||[];window.slug.push(data.slug);if(typeof uploadComplete=='function'){uploadComplete(responseText);}}
function enableExpiry(){expiryFormAdded=true;expiryForm=document.createElement('div');expiryForm.innerHTML='<form id="expiry-form"> <span>Delete after:</span> <div class="radio-option"> <input type="radio" name="expiry" value="1"> 1 hour</div> <div class="radio-option">  <input type="radio" name="expiry" value="24"> 1 day </div> <div class="radio-option"> <input type="radio" name="expiry" value="168"> 7 days </div> <div class="radio-option"> <input type="radio" name="expiry" value="720"> 30 days </div> </form>';ufWidget=document.getElementById("uf-widget");ufWidget.appendChild(expiryForm);var expireForm=document.getElementById('expiry-form');expiryForm.addEventListener("change",function(evt){var options=document.getElementsByName("expiry");if(options){for(var i=0;i<options.length;i++){if(options[i].checked){hours=options[i].value;}}}
var formData=new FormData();var arr=window.slug;for(var i=0;i<arr.length;i++){formData.append('slug[]',slug[i]);}
formData.append("hours",window.hours);formData.append("user_id",window.uploadfilesSettings.user_id);formData.append("auth_key",window.uploadfilesSettings.auth_key);var xhr=new XMLHttpRequest();xhr.open("POST","https://ufile.io/ajax/widget_expiry/",true);xhr.withCredentials=true;xhr.send(formData);},false);}