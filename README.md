# se3 Wizard

A responsive, jquery, bootstrap, ajax wizard.

##Methods

**init**
Loads the wizard takes JSON used to setup the wizard

To cofigure the init you need two JSON keys "tabs" and "config".

EXAMPLE:
```
se3wizard.init({
	tabs: {
			'Step 1': 'demo/Step1.html',
			'Step 2': 'demo/Step2.html'
		},
	config: {
			'saveurl' : 'demo/Save.html'
		}
});
```

Tabs define the steps of the wizard and the URL they will load. You can add as many steps as you need and but you must have at least one.
Config is used to customize the wizard. The minimum cofig option that is required is "saveurl", saveurl is used to define the page loaded via AJAX when the uses clicks the "Finish and Save" button.

* 'primarydiv':'Se3wizarddiv' USED to set the ID of the primary div you want to use to contain the wizard
* 'headerTxt' : 'My Se3 Wizard' USED to set the name that appears in the top bar of the wizard
* 'loadinggraphic' : 'img/loading.gif' USED to change the loading graphic that displays on page load
* 'backbtntext' : 'Back' USED to change the text of the back button defaults to "Back"
* 'backbtnclass' : 'btn-warning' USED to change the class of the back button
* 'continuebtntext' : 'Continue' USED to change the text of the continue button defaults to "Continue"
* 'continuebtnclass' : 'btn-warning' USED to change the class of the continue button
* 'finishbtntext' : 'Finish and Save' USED to change the text of the Finish and Save button defaults to "Finish and Save"
* 'finishbtnclass' : 'btn-warning' USED to change the class of the Finish and Save button
* 'saveurl' : 'demo/Save.html' USED to define the page loaded via AJAX when the uses clicks the "Finish and Save" button

**validate**
Can be used to validate form elements on each step return true to proceed or false to stop

**onContinue**
Called when the Continue button is clicked

**onBack**
Called when the Back button is clicked

**onStepComplete**
Called when ajax request to the step set from the tab options of the init is complete

**onFinish**
Called when the saveurl set from the config options of the init method is completed
