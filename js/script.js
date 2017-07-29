$(function(){

	/*To save data related to hypotheses*/
	hyp_data = [];
	hyp_selection_data = [];
	hyp_test_plan_data = [];

	/*To keep count of whether a tab is being clicked for the first time*/
	var prob_decompose_tab_count = 0;
	var hyp_gen_tab_count = 0;
	var test_tab_count = 0;
	var result_tab_count = 0;

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

			$('#nav-tab-id a[href="#gen_hyp"]').tab('show');

			//Show instructions for hypothesis generation
			show_hyp_instruction ();
		}

		if ($('input:radio[name="radio_solution_choice"]:checked').val() == 'explore_puzzle') {
			$('#solution_choice_screen').hide();
			$('#tabs_screen').show();
			$('#nav-tab-id a[href="#problem_understanding"]').tab('show')
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
		if (justification_text == "") {
			justification_text = "Dummy justification";
		}
		var selected_hypothesis = hyp_selection_data.pop();
		var order = hyp_selection_data.length + 1;
		selected_hypothesis.justification = justification_text;
		selected_hypothesis.seleceted_order = order;

		hyp_selection_data.push(selected_hypothesis);
	}

	function display_justification() {
		var order = hyp_selection_data.length - 1;
		var justification_text = hyp_selection_data[order].justification;
        $('<h5/>', {
			    'id':'justification_heading',
			    'text':'Your justification for selecting this hypothesis:',
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

	/*For Plan Test tab*/
	$( '#plan_test_tab' ).click(function() {
		//don't allow to click unless there is one hypothesis - on hover display - You need to enter a hypothesis to plan a test


		//Show the instructions when the tab is clicked first
		test_show_instruct();

		/*Save the selected hypothesis*/ 
		var length = hyp_selection_data.length;
		var selected_hypo = hyp_selection_data[length - 1];
		hyp_test_plan_data.push(selected_hypo);
		var selected_hypo_text = hyp_selection_data[length - 1].hypothesis;

		/*Display selected hypothesis*/
		$('#selected_hyp').html(selected_hypo_text);
	});

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
			  	'type':'text'
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
			  	'class':'form-control'
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
					  	'class':'form-control'
					}).appendTo('#enter_prediction').blur(function() {
						show_after_prediction_modal();
					});
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
			  	'type':'text'
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
			  	'class':'form-control'
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
					  	'class':'form-control'
					}).appendTo('#enter_prediction').blur(function() {
						show_after_prediction_modal();
					});
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
			  	'type':'text'
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
			  	'class':'form-control'
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
					  	'class':'form-control'
					}).appendTo('#enter_prediction').blur(function() {
						show_after_prediction_modal();
					});
					prediction_displayed = 1;
				}
			});
  		}
	});
	
	function show_after_prediction_modal() {
		$('#modal_after_prediction').show();
	}

	$( '#modal_after_prediction_close_button' ).click(function() {
  		$('#modal_after_prediction').hide();
	});

	$( '#modal_after_prediction_save_button' ).click(function() {
		var temp_hypothesis = hyp_test_plan_data.pop();
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

		temp_hypothesis.test_plan = {
			'device': selected_device,
			'plan':entered_plan,
			'prediction': entered_prediction
		}

		hyp_test_plan_data.push(temp_hypothesis);
  		$('#modal_after_prediction').hide();
	});

	/*For Result Interpretation Tab tab*/
	$( '#result_interpret_tab' ).click(function() {

		/*Pedagogy part*/
		/*Show instructions when clicked for the first time*/
		result_show_instruct();
		/*Append only if results tab is clicked for the first time*/
		if (result_tab_count == 0) {
			var order = hyp_test_plan_data.length;
			var temp_hyp = hyp_test_plan_data[order-1];

			$('<ul/>', {
				    'id':'hyp_info_list',
				  	'style':'list-style:none;'
				}).appendTo('#hyp_interpretation');

			$('<li/>', {
				    'id':'tested_hyp',
				  	'text': 'Hypothesis: ' + temp_hyp.hypothesis
				}).appendTo('#hyp_info_list');

			$('<li/>', {
				    'id':'tested_device',
				  	'text':'Device: ' + temp_hyp.test_plan.device
				}).appendTo('#hyp_info_list');

			$('<li/>', {
				    'id':'tested_plan',
				  	'text':'Plan: ' + temp_hyp.test_plan.plan
				}).appendTo('#hyp_info_list');

			$('<li/>', {
				    'id':'test_prediction',
				  	'text':'Prediction: ' + temp_hyp.test_plan.prediction
				}).appendTo('#hyp_info_list');

			result_tab_count = 1;
		}
	});

	$('#actual_result_tbox').blur(function(){
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
		).click(function() {
			display_interpretation_option();
		});

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
		).click(function() {
			display_interpretation_option();
		});
	});

	function display_interpretation_option() {
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
		show_hyp_instruction ();
	});



	/*To close initial modal*/
	$('#modal-hyp-gen-initial-close-button').click (function () {
		
		$('#modal-hyp-gen-initial').hide();
	});

	/*To close normal modal*/
/*	$('#modal-hyp-gen-normal-close-button').click (function () {
		
		$('#modal-hyp-gen-normal').hide();
	})*/

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
});