//////////////////////////////////////////////////////////////////
// Se3Wizard functions
///////////////////////////////////////////////////////////////////
var se3wizard={
	//*******************************************************
	"conf" : {
			'primarydiv' : 'Se3wizard',
			'headerTxt' : 'New Wizard',
			'loadinggraphic' : 'img/loading.gif',
			'backbtntext' : 'Back',
			'backbtnclass' : 'btn-warning',
			'continuebtntext' : 'Continue',
			'continuebtnclass' : 'btn-warning',
			'finishbtntext' : 'Finish and Save',
			'finishbtnclass' : 'btn-warning',
			'saveurl' : ''
			
	},
	//*******************************************************
	"error" : false,
	//*******************************************************
	"isMobile" : window.matchMedia("only screen and (max-width: 767px)"),
	//*******************************************************
	"init" : function(A){
				//*******************************************************
				// Make sure JSON has tabs : {}
				if(! A.hasOwnProperty('tabs'))
					return;
				
				//*******************************************************
				//Set tabs to JSON array	
				var jsonData=A.tabs;
				var hasForm=true;
				var hassaveUrl=false;
				
				// Build custom config values from the JSON data
				//*******************************************************
				$.each(A, function(i, item) {
					if(i == 'config'){
						$.each(item, function(key, val) {
							if(se3wizard.conf.hasOwnProperty(key)){
								se3wizard.conf[key]=val;
								
								if(key == 'saveurl')
									hassaveUrl=true;
							}
						});
					}
				});
				//*******************************************************
				// HTML Data
				//*******************************************************
				// If the primary div has a parent form use it if not 
				// create one
				//*******************************************************
				var parentForm=$('#' + this.conf['primarydiv']).closest("form");
					if(! parentForm.length){
						hasForm=false;
						parentForm=document.createElement('form');
						$(parentForm).attr('name','se3wizardform').attr('id','se3wizardform').addClass('se3wizardform');
					}else{
						parentForm.addClass('se3wizardform');
						if(parentForm.attr('id') == '')
							parentForm.attr('id','se3wizardform');
					}
				// Set our hidden action input
				//*******************************************************
				var inaction=document.createElement('input');
					$(inaction).attr('id','se3wizardaction').attr('name','se3wizardaction').attr('type','hidden');
				// Secondary wizard container
				//*******************************************************
				var parentdiv=document.createElement('div');
					$(parentdiv).addClass('se3formwizard').attr('id','se3formwizard');
				// Header
				//*******************************************************
				var headerdiv=document.createElement('div');
					$(headerdiv).addClass('se3wizardheader').attr('id','se3wizardheader');
					$(headerdiv).text(se3wizard.conf['headerTxt']);
				$(parentdiv).append(headerdiv);
				// Tab bar
				//*******************************************************
				var tabbar=document.createElement('div');
					$(tabbar).addClass('se3wizardtabbar').attr('id','se3wizardtabbar');
				var tabbarUL=document.createElement('ul');
				var progressbx=document.createElement('div');
					$(progressbx).addClass('se3wizardprogressbx').addClass('progress').attr('id','se3wizardprogressbx');
				// Progress bar
				//*******************************************************
				var progressbar=document.createElement('div');
					$(progressbar).addClass('progress-bar').attr('role','progressbar').attr('aria-valuenow','50').attr('aria-valuemin','0').attr('aria-valuemax','100').css('wdith','50%');
					$(progressbx).append(progressbar);
				// Add the tab UL and progress bar
				//*******************************************************
				$(tabbar).append(tabbarUL,progressbx);
				$(parentdiv).append(tabbar);
				// Content Div
				//*******************************************************
				var wizardcontent=document.createElement('div');
					$(wizardcontent).addClass('se3wizardcontent').attr('id','se3wizardcontent');
				// Data div (this is where all the ajax data will populate)
				//*******************************************************
				var wizardformdata=document.createElement('div');
					$(wizardformdata).addClass('se3wizardformdata').attr('id','se3wizardformdata');
				$(wizardcontent).append(wizardformdata);
				//Buttons
				//*******************************************************
				var glyphicon=document.createElement('span');
					$(glyphicon).addClass('glyphicon');
				var wizardbuttons=document.createElement('div');
					$(wizardbuttons).addClass('se3wizardbuttons').attr('id','se3wizardbuttons');

				//Back Button
				//*******************************************************
				var wizardbuttonback=document.createElement('div');
					$(wizardbuttonback).addClass('se3wizardbuttonback').attr('id','se3wizardbuttonback');
				var buttonback=document.createElement('button');
				var backchevron=$(glyphicon).clone();
					$(buttonback).addClass('btn').addClass(this.conf['backbtnclass']).attr('type','button');
					$(backchevron).addClass('glyphicon-chevron-left');
					$(buttonback).append(backchevron).append(this.conf['backbtntext']);
					$(buttonback).click(function(){
						id=$('#se3wizardtabbar ul li a.current').attr('id');
						id=id.replace('wizardstep','');
						last=parseInt(id)-1;
						last=parseInt(last,10);
						$('#se3wizardaction').val(last);
						se3wizard.loadstep(last);
						se3wizard.onBack();
						return false;
					});
				$(wizardbuttonback).append(buttonback);
				
				//Continue Button
				//*******************************************************
				var wizardbuttonforward=document.createElement('div');
					$(wizardbuttonforward).addClass('se3wizardbuttonforward').attr('id','se3wizardbuttonforward');
				var buttoncontinue=document.createElement('button');
				var continuechevron=$(glyphicon).clone();
					$(buttoncontinue).addClass('btn').addClass(this.conf['continuebtnclass']).attr('type','button');
					$(continuechevron).addClass('glyphicon-chevron-right');
					$(buttoncontinue).append(this.conf['continuebtntext']).append(continuechevron);
					$(buttoncontinue).click(function(){
						if(se3wizard.validate()){
							id=$('#se3wizardtabbar ul li a.current').attr('id');
							id=id.replace('wizardstep','');
							next=parseInt(id,10)+1;
							next=parseInt(next,10);
							$('#se3wizardaction').val(next);
							se3wizard.loadstep(next);
							se3wizard.onContinue();
						}
						return false;
					});
				$(wizardbuttonforward).append(buttoncontinue);
				
				// Save/Finish button
				//*******************************************************
				var wizardbuttonsave=document.createElement('div');
					$(wizardbuttonsave).addClass('se3wizardbuttonsave').attr('id','se3wizardbuttonsave');
				var buttonsave=document.createElement('button');;
					$(buttonsave).addClass('btn').addClass(this.conf['finishbtnclass']).attr('type','button').append(this.conf['finishbtntext']);
					$(buttonsave).click(function(){
						if(se3wizard.validate()){
							// Set links inactive
							//*******************************************************
							$('#se3wizardtabbar ul li a').off();
							$('#se3wizardtabbar ul li a').attr('class', 'inactive');
							
							// Hide all buttons
							//*******************************************************
							$('#se3wizardbuttons').hide();
							
							// set the progress bar to 100%
							//*******************************************************
							$('#se3wizardprogressbx div.progress-bar').html('100%'); 
							$('#se3wizardprogressbx div.progress-bar').attr('aria-valuenow',100);
							$('#se3wizardprogressbx div.progress-bar').css("width", "100%");
							
							// Change the action and post the form data
							//*******************************************************
							$('#se3wizardaction').val('finish');
							
							// Post with Ajax
							//*******************************************************
							$.ajax({
								type: "POST",
								cache: false,
								beforeSend: function(jqXHR,settings){
									$('#se3wizardformdata').html('');
									$('#se3wizardformdata').append(se3wizard.loader());
								},
								url: se3wizard.conf['saveurl'],
								data: $('.se3wizardform').serialize(),
								dataType : "html",
								success:function(data,textStatus,jqXHR) {
									$('#se3wizardformdata').html(data);
								},
								complete: se3wizard.onFinish,
								error :function(jqXHR,textStatus,errorThrown ) {
									$('#se3wizardbuttons button').prop('disabled', true);
									$('#se3wizardformdata').text(errorThrown);
									$('#se3wizardtabbar ul li a').attr('class', 'inactive');
									se3wizard.error=true;
								}
							});
							//*******************************************************
						}
						return false;
					});
				$(wizardbuttonsave).append(buttonsave);
					
				$(wizardbuttons).append(wizardbuttonback,wizardbuttonforward,wizardbuttonsave);
				$(wizardcontent).append(wizardbuttons);
				$(parentdiv).append(wizardcontent);
				
				//*******************************************************
				// Add new html to the primary div
				if(! hasForm){
					//If no form is defined add one
					$(parentForm).append(inaction,parentdiv);
					$('#' + this.conf['primarydiv']).append(parentForm);
				}else{
					// If there is a parent form don't add it
					$('#' + this.conf['primarydiv']).append(inaction,parentdiv);
				}
				//*******************************************************
				// END HTML DATA
				//*******************************************************
				

				// Default progress bar to 0
				//*******************************************************
				$('#se3wizardbuttonsave').hide();
				$('#se3wizardprogressbx div.progress-bar').html('0%').attr('aria-valuenow','0').css("width", "0");
				
				// Loop JSON and create tab navigation
				//*******************************************************
				$.each(A, function(i, item) {
					if(i == 'tabs'){
						var c=0;

						$.each(item, function(key, val) {
							lclass='inactive';
							// Set the first step active
							if(c == 0)
								lclass='current';
							
							// Add new list items for each step
							//*******************************************************
							$('#se3wizardtabbar ul').append('<li><a href="#" onclick="return false;" rel="' + val + '" class="' + lclass + '" id="wizardstep'+ parseInt(c,10) + '">' + key + '</a></li>');
							//*******************************************************
							if(! hassaveUrl)
								se3wizard.conf['saveurl']=val;
							c++;
						});
					}
				});
				//*******************************************************
				
				// Load the first set (note must be done after tab 
				// navigation creation)
				//*******************************************************
				$('#se3wizardaction').val(0);
				// Load the first step
				//*******************************************************
				this.loadstep(0);

			},
	//*******************************************************
	"loadstep" : function(S){

					//*******************************************************
					if(S == 0){
						//First set hide back button
						$('#se3wizardbuttonback').hide();
					}else{
						//Back button
						$('#se3wizardbuttonback').show();
					}
					
					//*******************************************************
					// Loop links to set the tab navigation
					//*******************************************************
					c=0;
					$('#se3wizardtabbar ul li a').each(function() {
						c++;
						id=$(this).attr('id');
						id=id.replace('wizardstep','');
						id=parseInt(id,10);
						// Current step
						if(id == S){
							$(this).attr('class', 'current');
							$(this).off();
						}
						// Steps greater then current
						if(id > S){
							$(this).attr('class', 'inactive');
							$(this).off();
						}
						// Steps less than current step
						if(id < S){
							$(this).attr('class', 'active');
							$(this).click(function(){
								id=$(this).attr('id');
								id=id.replace('wizardstep','');
								id=parseInt(id,10);
								$('#se3wizardaction').val(id);
								se3wizard.loadstep(id);
								return false;
							});
							
						}
					});
					//*******************************************************
					// End link loop
					//*******************************************************
					// Post with Ajax
					//*******************************************************
					$.ajax({
						type: "POST",
						cache: false,
						beforeSend: function(jqXHR,settings){
							$('#se3wizardformdata').empty();
							$('#se3wizardformdata').append(se3wizard.loader());
						},
						url: $('#se3wizardtabbar ul li a.current').attr('rel'),
						data: $('.se3wizardform').serialize(),
						dataType : "html",
						success:function(data,textStatus,jqXHR) {
							$('#se3wizardformdata').html(data);
						},
						complete: se3wizard.onStepComplete,
						error :function(jqXHR,textStatus,errorThrown ) {
							$('#se3wizardbuttons button').prop('disabled', true);
							$('#se3wizardformdata').text(errorThrown);
							$('#se3wizardtabbar ul li a').attr('class', 'inactive');
							se3wizard.error=true;
						}
					});
					//*******************************************************
					if(se3wizard.error) return;
					
					//Set progress bar
					//*******************************************************
					pbar=Math.round(S/c*100);
					if($('#se3wizardprogressbx div.progress-bar').attr("aria-valuenow") < pbar){
						$('#se3wizardprogressbx div.progress-bar').html(pbar + '%').attr('aria-valuenow',pbar).css("width", pbar + "%"); 
					}
					
					//*******************************************************
					if(S == c-1){
						//Hide Continue button show Save button 
						$('#se3wizardbuttonforward').hide();
						$('#se3wizardbuttonsave').show();
					}else{
						//Hide Save button show Continue button 
						$('#se3wizardbuttonforward').show();
						$('#se3wizardbuttonsave').hide();
					}

				},
	"loader" : function(){
					// Create the loading graphic
					//*******************************************************
					var loadingIMG=document.createElement('img');
						$(loadingIMG).attr('src',this.conf['loadinggraphic']).addClass('se3wizardloader');
					return loadingIMG;
				},
	//*******************************************************
	"validate" : function(){return true;},
	//*******************************************************
	"onFinish" : function(){},
	//*******************************************************
	"onContinue" : function(){},
	//*******************************************************
	"onBack" : function(){},
	//*******************************************************
	"onStepComplete" : function(){},
	//*******************************************************
	
};
