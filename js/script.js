$(function(){

	/*To save data related to hypotheses. All are lists of objects.*/

	/*List of all hypothesis to be displayed in the hypothesis sorting box in hypothesis generation window. 
	In the order in which it is generated.*/
	hyp_data = [];

	/*List of all hypothesis selected in the order in which it is selected*/
	hyp_selection_data = [];

	/*List of hypothesis - justification - test in the order in which it is generated*/
	hyp_test_plan_data = [];

	//List of all hypotheses selected, tested and interpreted
	hyp_history = [];

	now_count = 0;

	console.log(now_count + " in the  beginning there was nothing : ");
	console.log(hyp_test_plan_data);
	/*A variable to store the current hypothesis - justification - test - result - interpretation. */
	var cur_hyp_state = {
		"id":"",
		"hypothesis":"",
		"justification":"",
		"selection_order": "",
		"test_plan":[
		],
		"obtained": {
			"matches":"",
			"obtained_result": ""
		},
		"interpetation": {}
	};


	/*To keep count of whether a tab is being clicked for the first time*/
	var prob_decompose_tab_count = 0;
	var hyp_gen_tab_count = 0;
	var test_tab_count = 0;
	var result_tab_count = 0;
	var interpret_tab_count = 0;

	/*To keep track of no of tests a hypothesis has*/
	var test_no = 0;

	/* This string variable holds the value of the current view displayed on screen. The possible values are: intro,  */
	var current_view = "intro";

	
	/*Initial screens*/
	/*Note to me - Add functionality to be able to show this screens from any screen*/

	$('#show_problem_choice_screen_button').click(function() {
		
		$('#intro_screen').hide();
		$('#problem_choice_screen').show();
	});

	$('#show_problem1').click(function() {
		$('#problem_choice_screen').hide();
		$('#problem1_screen').show();
	});

	$('#problem1_solve_button').click(function() {
		$('#problem1_screen').hide();
		$('#solution_choice_screen').show();
		/*show initial instructions modal*/
	});
	
	$('#solution_choice_button').click(function() {
		if ($('input:radio[name="radio_solution_choice"]:checked').val() == 'explore_network') {
			$('#modal_initial_instruct').show();
			//Code for launching packet tracer and open corresponding problem should come here
		}

		if ($('input:radio[name="radio_solution_choice"]:checked').val() == 'gen_hyp') {
			$('#solution_choice_screen').hide();
			$('#tabs_screen').show();
			current_view = "hyp-gen-view";
			$('#nav-tab-id a[href="#gen_hyp"]').tab('show');

			//Show instructions for hypothesis generation
			show_hyp_instruction ();
		}

		if ($('input:radio[name="radio_solution_choice"]:checked').val() == 'explore_puzzle') {
			$('#solution_choice_screen').hide();
			$('#tabs_screen').show();
			$('#nav-tab-id a[href="#problem_understanding"]').tab('show');
		}
	});

	$('#modal-initial-instruct-close-button').click(function() {
		$('#modal_initial_instruct').hide();
	});

	/*Tabbed screens*/
	/*For Generate Hypothesis tab*/

	$( '#add-hypothesis-button' ).click(function() {
  		$('#modal-get-hypothesis').show();
	});

	$( '#modal-get-hypothesis-close-button' ).click(function() {
  		$('#modal-get-hypothesis').hide();
	});

	$( '#modal-get-hypothesis-save-button' ).click(function() {
  		save_hypothesis();
  		$('#modal-get-hypothesis').hide();
  		display_hypotheses();
	});

	function save_hypothesis() {
		var hyp = document.getElementById('hypothesis-tbox');
		if (hyp.value == "") {
			hyp.value = "Dummy hypothesis";
		}
		var id = uuid();
		var new_hyp = {
			"id": id,
			"hypothesis" : hyp.value
		}
		hyp_data.push(new_hyp);
	}

	function display_hypotheses () {
			var i = hyp_data.length - 1;
			var hyp_text = hyp_data[i].hypothesis;
			$('<li/>', {
			    'id':hyp_data[i].id,
			    'class':'ui-state-default ui-sortable-handle',
			    'style':'margin:0 5px 5px 5px;padding:5px;font-size:1.2em;width:350px;display:table;',
			    'text':hyp_text,
			}).appendTo('#sortable1');	

			$('<span/>', {
				'id':hyp_data[i].id,
			    'class':'glyphicon glyphicon-remove',
			    'style':'float:right;'
			}).appendTo('#' + hyp_data[i].id).click(function () {
				var this_id = $(this).attr('id');
				while(i--){
			        if( hyp_data[i] && hyp_data[i].hasOwnProperty('id') && hyp_data[i]['id'] === this_id ) { 
			           	hyp_data.splice(i,1);
			        }
			    }
			    hyp_data = hyp_data;
			    $(this).parent().remove();
			});	
		make_sortable();
	}

	function make_sortable(){
		$( "#sortable1, #sortable2, #sortable3, #sortable4" ).sortable({
      		connectWith: ".connectedSortable"
    	}).disableSelection();
	}	

	$( '#modal-get-justification-close-button' ).click(function() {
  		$('#modal-get-justification').hide();
	});

	$( '#modal-get-justification-save-button' ).click(function(e) {
  		save_justification(e);
  		$('#modal-get-justification').hide();
  		display_justification();
  		//disable_selection_of_other_hypotheses();
	});

	function save_justification(e) {
		var justification_text = document.getElementById('justification-tbox').value;
		//this should be removed later
		if (justification_text == "") {
			justification_text = "Dummy justification";
		}
		console.log(hyp_selection_data);
/*		var selection_length = hyp_selection_data.length;
		var selected_hypothesis = hyp_selection_data.pop();
		hyp_selection_data.push(selected_hypothesis);*/
		var order = hyp_selection_data.length;
		/*selected_hypothesis['justification'] = justification_text;
		selected_hypothesis['selecetion_order'] = order;*/

		//hyp_selection_data.push(selected_hypothesis);

		//set the current state values
		cur_hyp_state.justification = justification_text;
		cur_hyp_state.selection_order = order
	}

	function display_justification() {
		//var order = hyp_selection_data.length - 1;
		var justification_text = cur_hyp_state.justification;

		$('#justification_box').html("");
        $('<h5/>', {
			    'id':'justification_heading',
			    'text':'I want to test this hypothesis now beacuse, ',
			}).appendTo('#justification_box');
		$('<p/>', {
			    'id':'justification',
			    'text':justification_text,
			}).appendTo('#justification_box');
	}

	var observer = new MutationObserver(function(mutations) {
	    mutations.forEach(function(mutation) {
	        /*console.log(mutation);*/
	        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
	            // element added to DOM
	            var hasClass = [].some.call(mutation.addedNodes, function(el) {
	                return el.classList.contains('ui-state-default')
	            });
	            if (hasClass) {
	            	/*Get the id of the selected hypothesis*/
	            	if (mutation.previousSibling && mutation.previousSibling.nextElementSibling && mutation.previousSibling.nextElementSibling.firstElementChild ) {
	            		var selected_hyp_id = mutation.previousSibling.nextElementSibling.firstElementChild.id;
	                	$('#modal-get-justification').show();
	                	
	                	/*Get the hypothesis corresponding to the id*/
	                	var selected_hypothesis = get_hypothesis(selected_hyp_id);
	                	/*Push it to the hyp_selection_data array*/
	                	hyp_selection_data.push(selected_hypothesis);
	                	//set the values for current hypothesis state
	                	cur_hyp_state.hypothesis = selected_hypothesis.hypothesis;
	                	cur_hyp_state.id = selected_hypothesis.id;

	            	}	            	
	            }
	        }
	    }); 
	});
	var config = {
	    childList: true
	};
	observer.observe(document.getElementById('sortable2'), config);

	function get_hypothesis(id) {
		for (var i = 0; i < hyp_data.length; i++) {
			if (hyp_data[i].id == id) {
				return {
					"id": id,
					"hypothesis": hyp_data[i].hypothesis
				}
			}
		}
	}

	$('#hyp-gen-next-button').click(function() {
		if (cur_hyp_state.justification == "") {
			alert ("Please select at least one hypothesis to proceed next.");
		}
		else {
			$('#nav-tab-id a[href="#plan_test"]').tab('show');
			if (test_tab_count == 0) {
				display_plan_test_contents ();
			}			
		}
	});

	/*For Plan Test tab*/
	$('#plan-test-next-button').click(function() {

		cur_hyp_state['test_plan'].push(read_test_plan_data());
		if (cur_hyp_state.test_plan[test_no].device == "" || cur_hyp_state.test_plan[test_no].plan == "" || cur_hyp_state.test_plan[test_no].prediction == "") {
			alert ("Please enter all details to proceed next.");
		}
		else {
			//Show the dialog with instructions to open packet tracer
			/*$('#nav-tab-id a[href="#result"]').tab('show');*/
			save_test_plan_data();
			$('#modal_after_prediction').modal();
		}
	});

	function display_plan_test_contents () {
		//don't allow to click unless there is one hypothesis - on hover display - You need to enter a hypothesis to plan a test

		//set current screen to test screen
		current_view = "plan-test-view";

		//Show the instructions when the tab is clicked first
		test_show_instruct();

		/*Save the selected hypothesis*/ 
/*		var length = hyp_selection_data.length;
		var selected_hypo = hyp_selection_data[length - 1];

		if (test_no == 0) {
			hyp_test_plan_data.push(selected_hypo);
			console.log(now_count + " in the  display_plan_test_contents : ");
			console.log(hyp_test_plan_data);
		}

		var selected_hypo_text = hyp_selection_data[length - 1].hypothesis;*/

		/*Display selected hypothesis*/
		$('#selected_hyp').html(cur_hyp_state.hypothesis);

		//If test tab is encountered for second time, after testing one hypothesis, it should be empty.
		if (test_tab_count == 0) {
			$('#enter_plan').html("");
			$('#enter_prediction').html("");			
		}
	}

	$( 'input:radio[name="plan_option"]' ).change(function() {
		/*Flag to be set to 1 when the prediction box is displayed for the first time*/
		var prediction_displayed = 0;

		/*Remove prediction box if already displayed*/
		$('#enter_prediction').html("");

  		if ($(this).val() == 'option1') {
  			$('#enter_plan').html("");		
  			$('<div/>', {
			    'id':'plan_command_device_div',
			  	'class':'form-group'
			}).appendTo('#enter_plan');

  			$('<label/>', {
			    'id':'plan_command_device_label',
			  	'class':'control-label',
			  	'for':'plan_command_device_input',
			  	'text':'Enter the device in which you will execute the command'
			}).appendTo('#plan_command_device_div');

			$('<input/>', {
			    'id':'plan_command_device_input',
			  	'class':'form-control input-sm',
			  	'type':'text',
			  	'required':'required'
			}).appendTo('#plan_command_device_div');

			$('<br/>').appendTo('#plan_command_device_div');

  			$('<label/>', {
			    'id':'plan_command_label',
			  	'class':'control-label',
			  	'for':'plan_command_input',
			  	'text':'Enter the command'
			}).appendTo('#plan_command_device_div');

			$('<textarea/>', {
			    'id':'plan_command_input',
			  	'class':'form-control',
			  	'required':'required'
			}).appendTo('#plan_command_device_div').blur(function() {
				if (prediction_displayed == 0) {
					$('<label/>', {
					    'id':'predict_label',
					  	'class':'control-label',
					  	'for':'predict_text',
					  	'text':'Enter your prediction for the test: \n What changes do you expect to see after you perform the test?'
					}).appendTo('#enter_prediction');

					$('<textarea/>', {
					    'id':'predict_text',
					  	'class':'form-control',
					  	'required':'required'
					}).appendTo('#enter_prediction')/*.blur(function() {
						show_after_prediction_modal();
					})*/;
					prediction_displayed = 1;
				}
			});
  		}

  		if ($(this).val() == 'option2') {
  			$('#enter_plan').html("");		
  			$('<div/>', {
			    'id':'plan_config_device_div',
			  	'class':'form-group'
			}).appendTo('#enter_plan');

  			$('<label/>', {
			    'id':'plan_config_device_label',
			  	'class':'control-label',
			  	'for':'plan_config_device_input',
			  	'text':'Enter the device in which you will change the configuration'
			}).appendTo('#plan_config_device_div');

			$('<input/>', {
			    'id':'plan_config_device_input',
			  	'class':'form-control input-sm',
			  	'type':'text',
			  	'required':'required'
			}).appendTo('#plan_config_device_div');

			$('<br/>').appendTo('#plan_config_device_div');

			$('<label/>', {
			    'id':'plan_config_label',
			  	'class':'control-label',
			  	'for':'plan_config_input',
			  	'text':'Enter the configuration change'
			}).appendTo('#plan_config_device_div');

			$('<textarea/>', {
			    'id':'plan_config_input',
			  	'class':'form-control',
			  	'required':'required'
			}).appendTo('#plan_config_device_div').blur(function() {
				if (prediction_displayed == 0) {
					$('<label/>', {
					    'id':'predict_label',
					  	'class':'control-label',
					  	'for':'predict_text',
					  	'text':'Enter your prediction for the test: \n What changes do you expect to see after you perform the test?'
					}).appendTo('#enter_prediction');

					$('<textarea/>', {
					    'id':'predict_text',
					  	'class':'form-control',
					  	'required':'required'
					}).appendTo('#enter_prediction')/*.blur(function() {
						show_after_prediction_modal();
					})*/;
					prediction_displayed = 1;
				}
			});
  		}
  		
  		if ($(this).val() == 'option3') {
  			$('#enter_plan').html(""); 			
  			$('<div/>', {
			    'id':'plan_other_div',
			  	'class':'form-group'
			}).appendTo('#enter_plan');

  			$('<label/>', {
			    'id':'plan_other_device_label',
			  	'class':'control-label',
			  	'for':'plan_other_device_input',
			  	'text':'Enter the device/devices where you will execute the plan'
			}).appendTo('#plan_other_div');

			$('<input/>', {
			    'id':'plan_other_device_input',
			  	'class':'form-control input-sm',
			  	'type':'text',
			  	'required':'required'
			}).appendTo('#plan_other_div');

			$('<br/>').appendTo('#plan_other_div');

			$('<label/>', {
			    'id':'plan_other_label',
			  	'class':'control-label',
			  	'for':'plan_other_input',
			  	'text': 'Enter you plan'
			}).appendTo('#plan_other_div');

			$('<textarea/>', {
			    'id':'plan_other_input',
			  	'class':'form-control',
			  	'required':'required'
			}).appendTo('#plan_other_div').blur(function(id = $(this).attr(id)) {
				if (prediction_displayed == 0) {
					$('<label/>', {
					    'id':'predict_label',
					  	'class':'control-label',
					  	'for':'predict_text',
					  	'text':'Enter your prediction for the test: \n What changes do you expect to see after you perform the test?'
					}).appendTo('#enter_prediction');

					$('<textarea/>', {
					    'id':'predict_text',
					  	'class':'form-control',
					  	'required':'required'
					}).appendTo('#enter_prediction')/*.blur(function() {
						show_after_prediction_modal();
					})*/;
					prediction_displayed = 1;
				}
			});
  		}
	});
	
	/*This function returns the data that is currently present on the screen*/
	function read_test_plan_data () {
		var temp_test_data = {};

		var selected_radio_option = $('input[name=plan_option]:checked', '#plan_option_radio').val();
		var selected_device = "";
		var entered_plan = "";
		var entered_prediction = "";

		if (selected_radio_option == 'option1') {
			selected_device = $('#plan_command_device_input').val();
			entered_plan = 'Command - ' + $('#plan_command_input').val();
		}

		if (selected_radio_option == 'option2') {
			selected_device = $('#plan_config_device_input').val();
			entered_plan = 'Configuration change - ' +$('#plan_config_input').val();
		}

		if (selected_radio_option == 'option3') {
			selected_device = $('#plan_other_device_input').val();
			entered_plan = 'Other - ' + $('#plan_other_input').val();
		}

		entered_prediction = $('#predict_text').val();
		temp_test_data = {
			'device': selected_device,
			'plan':entered_plan,
			'prediction': entered_prediction
		}
		return 	temp_test_data;
	}

	function save_test_plan_data () {
/*	console.log(now_count + " in the  save_test_plan_data before pop : ");
	console.log(hyp_test_plan_data);		
		//Pop the last object because it doesn't have the test plan data yet
		var temp = hyp_test_plan_data.pop();
	console.log(now_count + " in the  save_test_plan_data after pop : ");
	console.log(hyp_test_plan_data);*/		
/*		console.log("Inside save test plan");
		console.log(hyp_test_plan_data);
		console.log(temp);*/
/*		var temp_hypothesis = {
			"id": temp.id,
			"hypothesis": temp.hypothesis,
			"justification": temp.justification,
			"seleceted_order": temp.seleceted_order,
			"test_plan":[]
		};*/
		//Get the current test plan data
		/*temp_hypothesis['test_plan'].push(read_test_plan_data());*/

		cur_hyp_state['test_plan'].push(read_test_plan_data());
	
		//Add the current test plan data to the popped hypothesis
/*		hyp_test_plan_data.push(temp_hypothesis);
	console.log(now_count + " in the  save_test_plan_data after push : ");
	console.log(hyp_test_plan_data);*/			
  		/*$('#modal_after_prediction').hide();*/
	};

	$('#modal_after_prediction_next_button').click (function() {
		display_result_tab();
		$('#nav-tab-id a[href="#result"]').tab('show');
		$('#modal_after_prediction').hide();
	});

	/*For Note Results tab*/
	function display_result_tab () {

		//Set current view to result tab
		current_view = "result-view";

		/*Pedagogy part*/

		/*Show instructions when clicked for the first time*/
		result_show_instruct();
		/*Append only if results tab is clicked for the first time*/
		if (result_tab_count == 0) {
			$('#hyp_interpretation').html("");
			var order = hyp_test_plan_data.length;
			var temp_hyp = hyp_test_plan_data[order-1];
	console.log(now_count + " in the  display_result_tab : ");
	console.log(hyp_test_plan_data);				
/*			console.log("Inside display result tab");
			console.log("test_no : " + test_no);
			console.log(temp_hyp);*/
			$('<ul/>', {
				    'id':'hyp_info_list',
				  	'style':'list-style:none;'
				}).appendTo('#hyp_interpretation');

			$('<li/>', {
				    'id':'tested_hyp',
				  	'text': 'Hypothesis: ' + cur_hyp_state.hypothesis
				}).appendTo('#hyp_info_list');

			$('<li/>', {
				    'id':'tested_device',
				  	'text':'Device: ' + cur_hyp_state.test_plan[test_no].device
				}).appendTo('#hyp_info_list');

			$('<li/>', {
				    'id':'tested_plan',
				  	'text':'Plan: ' + cur_hyp_state.test_plan[test_no].plan
				}).appendTo('#hyp_info_list');

			$('<li/>', {
				    'id':'test_prediction',
				  	'text':'Prediction: ' + cur_hyp_state.test_plan[test_no].prediction
				}).appendTo('#hyp_info_list');

			result_tab_count = 1;
		}
	}

	var compare_option_presented = 0;
	$('#actual_result_tbox').blur(function(){
		if (compare_option_presented == 0) {
			$('<label/>', {
				'id':'compare_results_label',
				'for':'compare_results_radio',
				'text':'Does the predicted result match with the obtained result?',
				'style':'display:block;'
			}).appendTo('#compare_results_div');

			$('<label/>', {
				'text':'Yes',
				'style':'display:block;'
			}).appendTo('#compare_results_div').append(
				$('<input/>', {
					'type':'radio',
					'name':'compare_results_radio',
					'id':'compare_results_yes',
					'value':'Yes',
					'style':'margin-left:7px'
				})
			);

			$('<label/>', {
				'text':'No',
				'style':'display:block;'
			}).appendTo('#compare_results_div').append(
				$('<input/>', {
					'type':'radio',
					'name':'compare_results_radio',
					'id':'compare_results_no',
					'value':'No',
					'style':'margin-left:7px'
				})
			);	

			compare_option_presented = 1;	
		}
	});

/*	function display_interpretation_option() {
		$('<label/>', {
			'id':'interpretation_option_label',
			'for':'interpretation_option',
			'text':'Based on the above observation, what do you want to do next?',
			'style':'display:block;'
		}).appendTo('#interpretation_option_div');

		$('<label/>', {
			'text':'Test another hypothesis',
			'style':'display:block;'
		}).appendTo('#interpretation_option_div').append(
			$('<input/>', {
					'type':'radio',
					'name':'interpretation_option',
					'id':'interpret_result_option1',
					'value':'option1',
					'style':'margin-left:7px'
			})
		); 

		$('<label/>', {
			'text':'Perform a different test for this hypothesis',
			'style':'display:block;'
		}).appendTo('#interpretation_option_div').append(
			$('<input/>', {
					'type':'radio',
					'name':'interpretation_option',
					'id':'interpret_result_option2',
					'value':'option2',
					'style':'margin-left:7px'
			})
		); 

		$('<label/>', {
			'text':'Generate a new hypothesis',
			'style':'display:block;'
		}).appendTo('#interpretation_option_div').append(
			$('<input/>', {
					'type':'radio',
					'name':'interpretation_option',
					'id':'interpret_result_option3',
					'value':'option3',
					'style':'margin-left:7px'
			})
		); 

		$('<label/>', {
			'text':'Something else',
			'style':'display:block;'
		}).appendTo('#interpretation_option_div').append(
			$('<input/>', {
					'type':'radio',
					'name':'interpretation_option',
					'id':'interpret_result_option4',
					'value':'option4',
					'style':'margin-left:7px'
			})
		); 

	}*/

	/*Result Interpret Tab*/
	
	$('#result-next-button').click(function() {
		cur_hyp_state.obtained = read_result_data();

		if (cur_hyp_state.obtained.matches == "" || cur_hyp_state.obtained.obtained_result == "") {
			alert ("Please enter all values to proceed next.");
		}
		else {
			/*save_obtained_result ();*/
			$('#nav-tab-id a[href="#interpret"]').tab('show');
			if (interpret_tab_count == 0) {
				display_interpret_contents ();
				interpret_tab_count = 1;
			}			
		}
	});

	function read_result_data(){
		var obtained_result = document.getElementById('actual_result_tbox').value;
		var selected_option = $('input:radio[name="compare_results_radio"]:checked').val();
		var temp_result = {
			"obtained_result": obtained_result,
			"matches": selected_option
		};
		return temp_result;
	}

/*	function save_obtained_result() {
	console.log(now_count + " in the  save_obtained_result before pop : ");
	console.log(hyp_test_plan_data);			
		var obtained_result = read_result_data();
		var temp_hyp_data = hyp_test_plan_data.pop();
		temp_hyp_data['obtained'] = obtained_result;
		hyp_test_plan_data.push(temp_hyp_data);
		console.log(now_count + " Save obtained result after push");
		console.log(hyp_test_plan_data);
	}*/

	/*Interpret tab begins*/


	function display_interpret_contents() {
		/* Blockquote contents in interpret results
		{	
			var order = hyp_test_plan_data.length;
			var temp_hyp = hyp_test_plan_data[order-1];
			console.log(temp_hyp);
			$('<ul/>', {
				    'id':'interpret_quote_list',
				  	'style':'list-style:none;'
				}).appendTo('#interpretation_quote');

			$('<li/>', {
				    'id':'interpret_quote_hyp',
				  	'text': 'Hypothesis: ' + temp_hyp.hypothesis
				}).appendTo('#interpret_quote_list');

			$('<li/>', {
				    'id':'interpret_quote_device',
				  	'text':'Device: ' + temp_hyp.test_plan.device
				}).appendTo('#interpret_quote_list');

			$('<li/>', {
				    'id':'interpret_quote_test_plan',
				  	'text':'Plan: ' + temp_hyp.test_plan.plan
				}).appendTo('#interpret_quote_list');

			$('<li/>', {
				    'id':'interpret_quote_prediction',
				  	'text':'Prediction: ' + temp_hyp.test_plan.prediction
				}).appendTo('#interpret_quote_list');

			$('<li/>', {
				    'id':'interpret_quote_obtained',
				  	'text':'Obtained Result: ' + temp_hyp.obtained.obtained_result
				}).appendTo('#interpret_quote_list');
		}*/
	}

	$('#interpret-next-button').click(function() {
		//save the decisions made
		var temp = {};
		temp['interpret_questions'] = {};
		temp.interpret_questions['q1'] = $('input:radio[name="interpret_q1_radio"]:checked').val();
		temp.interpret_questions['q2'] = $('input:radio[name="interpret_q2_radio"]:checked').val();
		temp.interpret_questions['q3'] = $('input:radio[name="interpret_q3_radio"]:checked').val();
		temp.interpret_questions['q4'] = $('input:radio[name="interpret_q4_radio"]:checked').val();
		temp['next_step_chosen'] = $('input:radio[name="interpret_option"]:checked').val();

/*	console.log(now_count + " in the  interpret next button before pop : ");
	console.log(hyp_test_plan_data);			
		var temp_hyp_data = hyp_test_plan_data.pop();
	console.log(now_count + " in the  interpret next button after pop : ");
	console.log(hyp_test_plan_data);	
		temp_hyp_data['result_interpretation'] = temp;
		hyp_test_plan_data.push(temp_hyp_data);
	console.log(now_count + " in the  interpret next button after push : ");
	console.log(hyp_test_plan_data);	*/	
		cur_hyp_state.intepretation = temp;	

		if ($('input:radio[name="interpret_option"]:checked').val() == 'diff_test') {
			empty_further_screens();
			current_view = "plan-test-view"
			$('#nav-tab-id a[href="#plan_test"]').tab('show');
			test_no++;
			save_test_plan_data ();
			display_plan_test_contents();
		}

		if ($('input:radio[name="interpret_option"]:checked').val() == 'test_hyp') {
			hyp_history.push(cur_hyp_state);
			/*empty_cur_hyp_state();*/
			rrent_view = "hyp-gen-view";
			empty_further_screens();
			$('#nav-tab-id a[href="#gen_hyp"]').tab('show');
			//display_hypotheses();
		}

		if ($('input:radio[name="interpret_option"]:checked').val() == 'generate_hyp') {
			current_view = "hyp-gen-view";
			empty_further_screens();
			$('#nav-tab-id a[href="#gen_hyp"]').tab('show');
			//display_hypotheses();			
		}

		if ($('input:radio[name="interpret_option"]:checked').val() == 'read') {
			current_view = "hyp-gen-view";
			empty_further_screens();
			$('#nav-tab-id a[href="#gen_hyp"]').tab('show');
			//display_hypotheses();

		}

		if ($('input:radio[name="interpret_option"]:checked').val() == 'explore') {
			$('#nav-tab-id a[href="#problem_understanding"]').tab('show');
			//Display the appropriate activity
			//decide_problem_explore_activity();
		}							
	})

	function empty_further_screens() {
		test_tab_count = 0;
		result_tab_count = 0;
		interpret_tab_count = 0;
		compare_option_presented = 0;

		$('#enter_plan').html("");
		$('#enter_prediction').html("");
		$('#compare_results_div').html("");
		$('#interpretation_option_div').html("");
		$('#interpret_q1_feedback').html("");
		$('#interpret_q2_feedback').html("");
		$('#interpret_q3_feedback').html("");
		$('#interpret_q4_feedback').html("");
	}

	/*Pedagogy Part*/

	/*Show instructions when each tab is clicked first*/
	function show_hyp_instruction() {
		if (hyp_gen_tab_count == 0) {
			$('#modal-hyp-gen-initial').modal();
		}
		hyp_gen_tab_count = 1;
	}

	$('#gen_hyp_tab').click (function () {
		current_view = "hyp-gen-view";
		show_hyp_instruction ();
	});

	/*To close initial modal*/
	$('#modal-hyp-gen-initial-close-button').click (function () {
		
		$('#modal-hyp-gen-initial').hide();
	});

	function test_show_instruct () {
		if (test_tab_count == 0) {
			$('#modal-test-initial').modal();
		}
		test_tab_count = 1;		
	}

	$('#modal-test-initial-close-button').click (function () {
		$('#modal-test-initial').hide();
	})

	$('#modal-result-initial-close-button').click (function () {
		$('#modal-result-initial').hide();
	})


	function result_show_instruct() {
		if (result_tab_count == 0) {
			$('#modal-result-initial').modal();
		}	
	}

	$('#avatar-widget').click(function () {
		if (current_view == "hyp-gen-view") {
			$('#modal-hyp-gen-after').modal();
		}

		if (current_view == "plan-test-view") {
			$('#modal-test-after').modal();
		}

		if (current_view == "result-view") {
			$('#modal-result-after').modal();
		}
	})

	/*If current view is hypothesis generation*/
	$('#modal-hyp-gen-after-close-button').click (function () {
		$('#modal-hyp-gen-after').hide();
		if ($('input:radio[name="hyp-gen-after"]:checked').val() == 'instructions') {
			$('#modal-hyp-gen-initial').modal();
		}

		if ($('input:radio[name="hyp-gen-after"]:checked').val() == 'hints') {
			$('#modal-hyp-gen-hints').modal();
		}		
	})

	$('#modal-hyp-gen-hints-close-button').click(function() {
		$('#modal-hyp-gen-hints').hide();
	})

	/*If current view is test*/
	$('#modal-test-after-close-button').click (function () {
		$('#modal-test-after').hide();
		if ($('input:radio[name="test-after"]:checked').val() == 'instructions') {
			$('#modal-test-initial').modal();
		}

		if ($('input:radio[name="test-after"]:checked').val() == 'hints') {
			$('#modal-test-hints').modal();
		}		
	})

	$('#modal-test-hints-close-button').click(function() {
		$('#modal-test-hints').hide();
	})

	/*If current view is result*/
	$('#modal-result-after-close-button').click (function () {
		$('#modal-result-after').hide();
		if ($('input:radio[name="result-after"]:checked').val() == 'instructions') {
			$('#modal-result-initial').modal();
		}

		if ($('input:radio[name="result-after"]:checked').val() == 'hints') {
			$('#modal-result-hints').modal();
		}		
	})

	$('#modal-result-hints-close-button').click(function() {
		$('#modal-result-hints').hide();
	})	

	$('#history-widget').click(function () {
		if (hyp_test_plan_data == "") {
			console.log("no hypothesis");
		}
		else {
			var array_length = hyp_test_plan_data.length;
			for (var i = 0; i < array_length; i++) {
				//Display all the hypotheses and test generated
				$('<p/>', {
				    'style':'color:#F1948A',
				    'text':'Generate more hypotheses about that device to find what exactly is the problem',
				}).appendTo('#interpret_q1_feedback');	
			}
		}

		$('#modal-history').modal();

	})

	$( 'input:radio[name="interpret_q1_radio"]' ).change(function() {
		$('#interpret_q1_feedback').html("");
		if ($('input:radio[name="interpret_q1_radio"]:checked').val() == 'Yes') {
			$('<p/>', {
			    'style':'color:#F1948A',
			    'text':'Generate more hypotheses about that device to find what exactly is the problem',
			}).appendTo('#interpret_q1_feedback');	
		}
		if ($('input:radio[name="interpret_q1_radio"]:checked').val() == 'No') {
			$('<p/>', {
			    'style':'color:#F1948A',
			    'text':'Generate more hypotheses to find the device which has a problem',
			}).appendTo('#interpret_q1_feedback');			
		}
	});

	$( 'input:radio[name="interpret_q2_radio"]' ).change(function() {
		$('#interpret_q2_feedback').html("");
		if ($('input:radio[name="interpret_q2_radio"]:checked').val() == 'Yes') {
			$('<p/>', {
			    'style':'color:#F1948A',
			    'text':'Eliminate that device from further considerations',
			}).appendTo('#interpret_q2_feedback');			
		}
		if ($('input:radio[name="interpret_q2_radio"]:checked').val() == 'No') {
			$('<p/>', {
			    'style':'color:#F1948A',
			    'text':'Generate more hypotheses to find the device which has a problem',
			}).appendTo('#interpret_q2_feedback');	
		}
	});

	$( 'input:radio[name="interpret_q3_radio"]' ).change(function() {
		$('#interpret_q3_feedback').html("");
		if ($('input:radio[name="interpret_q3_radio"]:checked').val() == 'Yes') {
			$('<p/>', {
			    'style':'color:#F1948A',
			    'text':'Focus you investigations on the layers above the fuctioning layer',
			}).appendTo('#interpret_q3_feedback');
		}
		if ($('input:radio[name="interpret_q3_radio"]:checked').val() == 'No') {
			$('<p/>', {
			    'style':'color:#F1948A',
			    'text':'Generate more hypotheses to find the network layer which has a problem',
			}).appendTo('#interpret_q3_feedback');	
		}
	});

	$( 'input:radio[name="interpret_q4_radio"]' ).change(function() {
		$('#interpret_q4_feedback').html("");
		if ($('input:radio[name="interpret_q4_radio"]:checked').val() == 'Yes') {
			$('<p/>', {
			    'style':'color:#F1948A',
			    'text':'Focus your investigation on that layer of the network',
			}).appendTo('#interpret_q4_feedback');
		}
		if ($('input:radio[name="interpret_q4_radio"]:checked').val() == 'No') {
			$('<p/>', {
			    'style':'color:#F1948A',
			    'text':'Generate more hypotheses to find the network layer which has a problem',
			}).appendTo('#interpret_q4_feedback');	
		}
	});



});