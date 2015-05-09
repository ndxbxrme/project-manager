//tries its best to interpret a date string
//requires jquery
//needs a lot of work and tidying up
//prefers english style dates
//let me know if you want to help
//https://github.com/ndxbxrme
//basic usage
//var iD = interpretDate();
//iD.interpretText('tomorrow 3pm')
//iD.formatDuration(iD.interpretDuration('one and a half hours')) / returns '1 hour 30 minutes'

var interpretDate = function(){
    //sometimes start specifiers get put as periods
	var week_start_day = 0;
	var INCLUSIVE = true;
	var period_specifier = [
		{name:'This',value:'This',is_simple:true},
		{name:'Next',value:'Next',is_simple:true},
		{name:'Previous',value:'Previous',is_simple:true},
		{name:'Rolling Forward',value:'RollingForward',is_simple:true},
		{name:'Rolling Back',value:'RollingBack',is_simple:true},
		{name:'First',value:'First',is_simple:false},
		{name:'Nth',value:'Nth',is_simple:false},
		{name:'Last',value:'Last',is_simple:false},
		{name:'Specific',value:'Specific',is_simple:false}
	];
	var period_type = {
		simple:[
			{name:'Hour',value:'Hour'},
			{name:'Day',value:'Day'},
			{name:'Week',value:'Week'},
			{name:'Month',value:'Month'},
			{name:'Year',value:'Year'},
			{name:'4 Weeks',value:'4 Weeks'},
			{name:'Specific',value:'Specific'}
		],
		complex:[
			{name:'Hour',value:'Hour'},
			{name:'Day',value:'Day'},
			{name:'Week',value:'Week'},
			{name:'Month',value:'Month'},
			{name:'Year',value:'Year'},
			{name:'Specific',value:'Specific'}
		]
	};
	var relative_specifier = [
		{name:'This',value:'This'},
		{name:'Next',value:'Next'},
		{name:'Previous',value:'Previous'},
		{name:'Specific',value:'Specific'}
	];
	var relative_type = [
		{name:'Hour',value:'Hour'},
		{name:'Day',value:'Day'},
		{name:'Week',value:'Week'},
		{name:'Month',value:'Month'},
		{name:'Year',value:'Year'}
	];
	var repeat_type = [
		{name:'Day',value:'Day'},
		{name:'Week',value:'Week'},
		{name:'Month',value:'Month'},
		{name:'Year',value:'Year'}
	];
	var split_into = [
		{name:'Don\'t Split',value:'Total'},
		{name:'Hours',value:'Hours'},
		{name:'Days',value:'Days'},
		{name:'Weeks',value:'Weeks'},
		{name:'Months',value:'Months'},
		{name:'Years',value:'Years'}
	];
	var arrange_by = [
		{name:'Date',value:'Date'},
		{name:'Entered order',value:'Entered'}
	];
	function reset_date_inputs(){
		$('#period_specifier').html('');
		$.each(period_specifier,function(){
			$('#period_specifier').append("<option value=\"" + this.value + "\">" + this.name + "</option>");
		});
		$('#period_type').html('');
		$.each(period_type.simple,function(){
			$('#period_type').append("<option value=\"" + this.value + "\">" + this.name + "</option>");
		});
		$('#relative_specifier').html('');
		$.each(relative_specifier,function(){
			$('#relative_specifier').append("<option value=\"" + this.value + "\">" + this.name + "</option>");
		});
		$('#relative_type').html('');
		$.each(relative_type,function(){
			$('#relative_type').append("<option value=\"" + this.value + "\">" + this.name + "</option>");
		});
		$('#repeat_type').html('');
		$.each(repeat_type,function(){
			$('#repeat_type').append("<option value=\"" + this.value + "\">" + this.name + "</option>");
		});
		$('#split_into').html('');
		$.each(split_into,function(){
			$('#split_into').append("<option value=\"" + this.value + "\">" + this.name + "</option>");
		});
		$('#arrange_by').html('');
		$.each(arrange_by,function(){
			$('#arrange_by').append("<option value=\"" + this.value + "\">" + this.name + "</option>");
		});

		

		$('#period_specifier').unbind();
		$('#period_specifier').change(change_period_specifier);
		change_period_specifier();
	}
	function change_period_specifier() {
		$('#period_specifier_numerator,#period_numerator,#relative,#repeat,#relative_numerator').hide();
		$.each(period_specifier,function(){
			if(this.value==$('#period_specifier').val()) {
				var types = [];
				if(this.is_simple){
					types = period_type.simple;
				} else {
					types = period_type.complex;
					$('#period_numerator').val('1').show();
					$('#relative,#repeat').show();
				}
				$('#period_type').html('');
				$.each(types,function(){
					$('#period_type').append("<option value=\"" + this.value + "\">" + this.name + "</option>");
				});
			}
		});
	}
	function get_type_index(type) {
		var year_index = -1;
		for(var f=0; f<type_order.length; f++){
			if(type_order[f].value=='year')
				year_index = f;
			if(type_order[f].value==type) {
				return f;
			}
		}
		return year_index;
	}
	var type_order = [
		{value:'number',base_type:'day'},
		{value:'second',base_type:'time'},
		{value:'minute',base_type:'time'},
		{value:'hour',base_type:'time'},
		{value:'time',base_type:'time'},
		{value:'day_name',base_type:'day'},
		{value:'day',base_type:'day'},
		{value:'week',base_type:'day'},
		{value:'day_month',base_type:'day'},
		{value:'day_name_month',base_type:'day'},
		{value:'month',base_type:'month'},
		{value:'day_name_month_year',base_type:'month'},
		{value:'day_name_year',base_type:'day'},
		{value:'month_year',base_type:'month'},
		{value:'year',base_type:'year'},
		{value:'decade',base_type:'year'},
		{value:'century',base_type:'year'},
		{value:'full_date',base_type:'day'}
		];
	var pos_nos = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelveth','thirteenth','fourteenth','fifteenth','sixteenth','seventeenth','eighteenth','nineteenth'];
	var pos_tens = ['twentieth','thirtieth','fortieth','fiftieth','sixtieth','seventieth','eightieth','ninetieth'];
	var num_tens = ['twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
	var num_singles = ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
	var days = ['mon','tue','wed','thu','fri','at','un'];
	var months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
	//the placement of words in the word list is very important, small words get eaten first so make sure 'to' is above 'tomorrow' etc
	var word_list = [
		{word:'the',type:'ignore'},
		{word:'into',type:'ignore'},
		
		{word:'inclusive',value:'inclusive',type:'period_modifier'},
		{word:'inc',value:'inclusive',type:'inclusive'},
		{word:'exclusive',value:'exclusive',type:'period_modifier'},
		{word:'ex',value:'exclusive',type:'inclusive'},
		{word:'total',value:'total',type:'total'},

		{word:'in',value:' in ',type:'starting_declaration'},
		
		{word:'yesterday',value:'yesterday ',type:'full_date',data:{
			period_specifier:'last',
			period_type:'day',
			starting_specifier:'this',
			starting_type:'day'
		}},
		{word:'tomorrow',value:'tomorrow ',type:'full_date',data:{
			period_specifier:'next',
			period_type:'day',
			starting_specifier:'this',
			starting_type:'day'
		}},
		{word:'today',value:'today ',type:'full_date',data:{
			period_specifier:'this',
			period_type:'day',
			starting_specifier:'this',
			starting_type:'day'
		}},
		{word:'now',value:'now ',type:'full_date',data:{
			period_specifier:'this',
			period_type:'minute',
			starting_specifier:'this',
			starting_type:'day'
		}},

		{word:'ago',value:'ago ',type:'period_modifier'},
		
		{word:'this',value:'this ',type:'period_specifier'},
		{word:'next',value:'next ',type:'period_specifier'},
		{word:'last',value:'last ',type:'period_specifier'},
		{word:'previous',value:'previous ',type:'period_specifier'},
		{word:'first',value:'first ',type:'period_specifier'},
		{word:'rolling forward',value:'rollingforward ',type:'period_specifier'},
		{word:'rolling back',value:'rollingback ',type:'period_specifier'},
		{word:'every',value:'every ',type:'period_specifier',disambiguation:[
				{after:['date_part']}
			]
		},
		{word:'each',value:'every ',type:'period_specifier'},
		{word:'every',type:'repeat_declaration',disambiguation:[
				{after:['period_type']},
				{after:['number','period_type']}
			]
		},
		{word:'on',value:' on ',type:'starting_declaration'},
		{word:'of',value:' of ',type:'starting_declaration2'},
		{word:'for',value:' for ',type:'starting_declaration'},
		{word:'from',value:' from ',type:'period_declartion'},
		{word:'starting',value:' from ',type:'starting_declaration'},
		{word:'start',value:' from ',type:'starting_declaration'},
		{word:'ending',value:' to ',type:'range_declaration'},
		{word:'end',value:' to ',type:'range_declaration'},
		{word:'to',value:' to ',type:'range_declaration'},
		
		{word:'- ',value:' - ',type:'range_declaration'},
		{word:'-',value:'-',type:'range_declaration'},
		{word:'<',value:'<',type:'range_declaration'},
		{word:'<=',value:'<=',type:'range_declaration'},
		{word:'split',value:'split',type:'split_declaration'},
		{word:'s',type:'ignore'},

		{word:'minute',value:'minute ',type:'period_type'},
		{word:'hour',value:'hour ',type:'period_type'},
		{word:'day',value:'day ',type:'period_type'},
		{word:'week',value:'week ',type:'period_type'},
		{word:'month',value:'month ',type:'period_type'},
		{word:'year',value:'year ',type:'period_type'},
		{word:'decade',value:'decade ',type:'period_type'},
		{word:'century',value:'century ',type:'period_type'},

		{word:'half',value:'half ',type:'period_modifier'},
		{word:'quarter',value:'quarter ',type:'period_modifier'},
		{word:'third',value:'third ',type:'period_modifier'},

		

		{word:', ',value:' , ',type:'seperator'},

		{word:'/',value:'/',type:'date_part'},
		{word:'\\\\',value:'\\',type:'date_part'},
		{word:'-',value:'-',type:'date_part'},
		{word:':',value:':',type:'date_part'},
		{word:';',value:';',type:'date_part'},
		{word:'\\.',value:'.',type:'date_part'},
		{word:'am',value:'am ',type:'date_part'},
		{word:'pm',value:'pm ',type:'date_part'}/*,
		{word:'a',value:'am ',type:'date_part'},
		{word:'p',value:'pm ',type:'date_part'}*/
	];
	/*
		date
			period[]
				specifier
					numerator (eg 3rd)
				numerator
				type
			starting_on
				specifier
				type
			ending_on
				specifier
				type
			relative_to
				specifier
				type
			repeat
				type
				ammount
	*/
	function DateRange() {
		this.object_type = 'date_range';
		this.from = null;
		this.to = null;
	}
	function Range() {
		this.object_type = 'range';
		this.from = [];
		this.to = [];
		this.get_smallest_type = function(arm) {
			var smallest_type = type_order.length-1;
			for(var n=0; n<this.from.length; n++) {
				//this.get_largest_type();
				var tmp = this.from[n].get_smallest_type();
				if(tmp>0) //ignore numbers
					if(tmp<smallest_type) smallest_type = tmp;
			}
			for(var n=0; n<this.to.length; n++) {
				//this.get_largest_type();
				var tmp = this.to[n].get_smallest_type();
				if(tmp>0)
					if(tmp<smallest_type) smallest_type = tmp;
			}
			this.smallest_type = smallest_type;
			return smallest_type;
		};
		this.get_largest_type_for_arm = function(arm) {
			var largest_type = -1;
			for(var n=0; n<this[arm].length; n++) {
				var tmp = this[arm][n].get_largest_type();
				if(tmp>largest_type) largest_type = tmp;
			}
			return largest_type;
		}
		this.get_largest_type = function() {
			var largest_type = -1;
			var largest_from = -1;
			for(var n=0; n<this.from.length; n++) {
				//this.get_largest_type();
				var tmp = this.from[n].get_largest_type();
				if(tmp>largest_type) largest_type = tmp;
			}
			largest_from = largest_type;
			for(var n=0; n<this.to.length; n++) {
				//this.get_largest_type();
				var tmp = this.to[n].get_largest_type();
				if(tmp>largest_type) largest_type = tmp;
			}
			if(largest_type>largest_from) {
				this.largest_arm = 'to';
				this.shortest_arm = 'from';
			}
			else {
				this.largest_arm = 'from';
				this.shortest_arm = 'to';
			}
			/*$.each(this.from,function(i){
				var tmp = this.get_largest_type();
				this.get_smallest_type();
				if(tmp>largest_type) largest_type = tmp;
			});
			$.each(this.to,function(i){
				var tmp = this.get_largest_type();
				this.get_smallest_type();
				if(tmp>largest_type) largest_type = tmp;
			});*/
			this.largest_type = largest_type;
			return largest_type;
		};
		this.largest_arm = null;
		this.shortest_arm = null;
		this.smallest_type = null;
		this.largest_type = null;
		this.is_inclusive = function(){
			if(this.processed_date) {
				if(this.processed_date.from.is_inclusive==true) return true;
				if(this.processed_date.to && this.processed_date.to.is_inclusive==true) return true;
			}
			return false;
		}
	}
	function Period(data){
		this.object_type = 'period';
		this.period_specifier = null;
		this.period_type = null;
		this.processed_date = null;
		this.period_modifier = null;
		this.n_value = null;
		this.starting_specifier = null;
		this.starting_type = null;
		this.starting_date = null;
		this.starting_modifier = null;
		this.largest_type = null;
		this.smallest_type = null;
		this.is_inclusive = false;
		if(data) {
			if(data.period_specifier) this.period_specifier = data.period_specifier;
			if(data.period_type) this.period_type = data.period_type;
			if(data.processed_date) this.processed_date = data.processed_date;
			if(data.period_modifier) this.period_modifier = data.period_modifier;
			if(data.n_value) this.n_value = data.n_value;
			if(data.starting_specifier) this.starting_specifier = data.starting_specifier;
			if(data.starting_type) this.starting_type = data.starting_type;
			if(data.starting_date) this.starting_date = data.starting_date;
			if(data.starting_modifier) this.starting_modifier = data.starting_modifier;
		}
		this.get_smallest_type = function(){
			var smallest_type = type_order.length-1;
			if(this.period_type!=null) {
				var tmp = get_type_index(this.period_type);
				if(tmp<smallest_type) smallest_type = tmp;
			}
			if(this.starting_type!=null) {
				var tmp = get_type_index(this.starting_type);
				if(tmp<smallest_type) smallest_type = tmp;
			}
			if(this.processed_date!=null) {
				var tmp = get_type_index(this.processed_date.from.type);
				if(tmp>0)
					if(tmp<smallest_type) smallest_type = tmp;
				if(this.processed_date.to) {
					tmp = get_type_index(this.processed_date.to.type);
					if(tmp>0)
						if(tmp<smallest_type) smallest_type = tmp;
				}
			}
			this.smallest_type = smallest_type;
			return smallest_type;
		}
		this.get_largest_type = function(){
			var largest_type = 0;
			if(this.period_type!=null) {
				var tmp = get_type_index(this.period_type);
				if(tmp>largest_type) largest_type = tmp;
			}
			if(this.starting_type!=null) {
				var tmp = get_type_index(this.starting_type);
				if(tmp>largest_type) largest_type = tmp;
			}
			if(this.processed_date!=null) {
				var tmp = get_type_index(this.processed_date.from.type);
				if(tmp>largest_type) largest_type = tmp;
				if(this.processed_date.to) {
					tmp = get_type_index(this.processed_date.to.type);
					if(tmp>largest_type) largest_type = tmp;
				}
			}
			largest_type *= 2;
			if(this.period_specifier!=null || this.processed_date!=null) largest_type++;
			this.largest_type = largest_type;
			return largest_type;
		}


		this.is_range = function(){
			if(this.processed_date!=null&&this.processed_date.to!=null)
				return true;
			else
				return false;
		};
		this.has_data = function() {
			if(this.processed_date!=null||this.period_specifier!=null||this.period_type!=null||this.period_modifier!=null)
				return true;
			else
				return false;
		};
		this.needs_start = function() {
			if(this.starting_date==null&&this.starting_specifier==null&&this.starting_type==null&&this.starting_modifier==null)
				return true;
			else
				return false;
		};
		this.add_start = function(period) {
			this.starting_specifier = period.period_specifier;
			this.starting_type = period.period_type;
			this.starting_date = period.processed_date;
			this.starting_modifier = period.period_modifier;
		};
	}
	function sort_by_type(b,a) {
		var x = a.largest_type;
		var y = b.largest_type;
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	}
	function sort_by_number(b,a) {
		var x = 0;
		var y = 0;
		if(a.processed_date) x = parseInt(a.processed_date.from.value);
		if(b.processed_date) y = parseInt(b.processed_date.from.value);
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	}
	var range_processed_arr = [];
	var last_text = '';
	function interpret_text(text) {
		if(text==last_text) return;
		last_text = text;
		text = text.toLowerCase();
		text = text.replace(/([0-9]+)\s+([0-9]+)/g,'$1, $2');  //puts a seperator between 2 numbers
		//text = text.replace(/(nd|rd|th)(?=\s)/gi,'st'); //
		text = text.replace(/and|&/gi,'');
		text = text.replace(/\s+/gi,' '); //remove double spaces
		//trim,replace numbers
		text = replace_numbers(text);
		var outarr = extract_words(text);
		//disambiguate ambiguous words
		for(var f=0; f<outarr.length; f++){
			if(outarr[f].disambiguation) {
			}
		}
		//send date like chunks to the date processor
		var date_processed_arr = [];
		var thisbit = [];
		var lastbit = null;
		for(var f=0; f<outarr.length; f++) {
			
			/*
				month_name
				day_name
				number
				unknown
				date_part
				only if not 1st or last
					range_declaration
					starting_declaration
			*/
			switch(outarr[f].type) {
				case 'month_name':
				case 'day_name':
				case 'number':
				case 'unknown':
				case 'date_part':
					thisbit[thisbit.length] = {bit:outarr[f],special:false};
					lastbit = null;
				break;
				case 'period_specifier_number':
					//if next one is a number then dont send to date processor
					if(outarr[f+1]&&outarr[f+1].type=='number'||lastbit=='special') {
						date_processed_arr = send_to_date_processor(thisbit,lastbit,date_processed_arr);
						date_processed_arr[date_processed_arr.length] = outarr[f];
						thisbit = [];
						lastbit = null;
					}
					else {
						thisbit[thisbit.length] = {bit:outarr[f],special:true};
						lastbit = null; ///watch this!!!
					}
				break;
				case 'range_declaration':
				case 'starting_declaration2':
					if(thisbit.length>0) {
						thisbit[thisbit.length] = {bit:outarr[f],special:true};
						lastbit = 'special';
					}
					else {
						date_processed_arr[date_processed_arr.length] = outarr[f];
					}
				break;
				default:
					//send to date processor
					//if the last bit was special then don't send it and remember to add it to the output array
					date_processed_arr = send_to_date_processor(thisbit,lastbit,date_processed_arr);
					thisbit = [];
					lastbit = null;
					date_processed_arr[date_processed_arr.length] = outarr[f];
					
				break;
			}
			
		}
		date_processed_arr = send_to_date_processor(thisbit,lastbit,date_processed_arr);
		thisbit = [];
		lastbit = null;
		//try and extract some meaning from all this nonsense
		//group together period bits
		//periods consist of a date bit, a period specifer and a period type
		//a period can have up to one of each
		//a declaration starts a new period
		//need to watch for weird periods, hmmm
		var period_processed_arr = [];
		var this_period = new Period();
		$.each(date_processed_arr,function(){
			switch (this.type)
			{
				case 'processed_date':
				case 'period_specifier':
				case 'period_type':
				case 'period_modifier':
					if(this_period[this.type]!=null) {
						period_processed_arr[period_processed_arr.length] = this_period;
						this_period = new Period();
					}
					if(typeof(this.value)=='string') this_period[this.type]=this.value.replace(/^\s+|\s+$/gi,'');
					else this_period[this.type] = this.value;
					break;
				case 'period_specifier_number':
					if(this_period['period_specifier']!=null) {
						period_processed_arr[period_processed_arr.length] = this_period;
						this_period = new Period();
					}
					this_period['period_specifier']='nth';
					this_period.n_value = this.value;
					break;
				case 'full_date':
					if(this_period.has_data()) {
						period_processed_arr[period_processed_arr.length] = this_period;
						//this_period = new Period();
					}
					this_period = new Period(this.data);
					period_processed_arr[period_processed_arr.length] = this_period;
					this_period = new Period();
					break;
				default:
					if(this_period.has_data()) {
						period_processed_arr[period_processed_arr.length] = this_period;
						this_period = new Period();
					}
					period_processed_arr[period_processed_arr.length] = this;
					break;
			
			}
		});
		if(this_period.has_data()) {
			period_processed_arr[period_processed_arr.length] = this_period;
			this_period = new Period();
		}
		//clean up modifiers
		//get split info
		/*var split_period = null;
		for(var f=0; f<period_processed_arr.length; f++)
		{
			if(period_processed_arr[f].word && period_processed_arr[f].type=='split_declaration') {
				if(period_processed_arr[f+1] && period_processed_arr[f+1].object_type && period_processed_arr[f+1].object_type=='period'
					&& period_processed_arr[f+1].is_range()==false) {
						period_processed_arr[f+1].period_specifier = 'every';
						//split_period = period_processed_arr[f+1];
						period_processed_arr.splice(f,1/*2* /);
					}
			}
		}*/
		/*
			fix some bits
		*/
		/*for(var f=0; f<period_processed_arr.length; f++) {
			if(period_processed_arr[f].object_type) {
				if(period_processed_arr[f].object_type=='period') {
					if(period_processed_arr[f].needs_start()==false) {
						var myperiod = new Period();
						myperiod.period_type = period_processed_arr[f].starting_type;
						myperiod.period_specifier = period_processed_arr[f].starting_specifier;
						myperiod.processed_date = period_processed_arr[f].starting_date;
						myperiod.period_modifier = period_processed_arr[f].starting_modifier;
						period_processed_arr[f].starting_type = null;
						period_processed_arr[f].starting_specifier = null;
						period_processed_arr[f].starting_date = null;
						period_processed_arr[f].starting_modifier = null;
						period_processed_arr.splice(f,0,myperiod);
					}
				}
			}
		}*/
		for(var f=0; f<period_processed_arr.length; f++) {
			if(period_processed_arr[f] && period_processed_arr[f].object_type) {
				if(period_processed_arr[f].object_type=='period') {
					if(period_processed_arr[f].processed_date) {
						if(period_processed_arr[f].processed_date &&
							period_processed_arr[f].processed_date.from.type=='month_year' &&
							period_processed_arr[f].period_type!=null) {
							
							var bit_match = period_processed_arr[f].processed_date.from.value.match(/^([0-9]+)[^0-9]+([0-9]+)/);
							if(bit_match!=null) {

								var bit_period = new Period();
								bit_period.period_type = period_processed_arr[f].period_type;
								bit_period.processed_date = {from:{value:bit_match[1],type:'number'}};
								var year_period = new Period();
								year_period.processed_date = {from:{value:bit_match[2],type:'year'}};
								period_processed_arr.splice(f,1,bit_period,year_period);
							}
						}
						else {
							//split complex types
							if(period_processed_arr[f].is_range()==true) {
								var my_range = new Range();
								split_complex_types(period_processed_arr[f].processed_date.from,null,my_range.from,0,period_processed_arr[f],'from').add_arr;
								split_complex_types(period_processed_arr[f].processed_date.to,null,my_range.to,0,period_processed_arr[f],'to').add_arr;
								period_processed_arr.splice(f,1,my_range);
							}
							else {
								split_complex_types(period_processed_arr[f].processed_date.from,period_processed_arr,null,f,period_processed_arr[f],'from');
							}
						}
					}
				}
			}
		}
		//unfuck periods
		for(var f=0; f<period_processed_arr.length; f++) {
			if(period_processed_arr[f] && period_processed_arr[f].object_type) {
				if(period_processed_arr[f].object_type=='period') {
					if(period_processed_arr[f].period_type!=null && period_processed_arr[f].period_specifier!=null && period_processed_arr[f].processed_date
						&& period_processed_arr[f].processed_date.from.value!=null && period_processed_arr[f].processed_date.from.type!='number') {
						var my_period = new Period();
						my_period.period_type = period_processed_arr[f].period_type;
						my_period.period_specifier = period_processed_arr[f].period_specifier;
						period_processed_arr[f].period_type = null;
						period_processed_arr[f].period_specifier = null;
						period_processed_arr.splice(f,0,my_period);
					}
					if(period_processed_arr[f].period_modifier=='ago' && f>0) {
						if(period_processed_arr[f].period_type==null) {
							period_processed_arr[f].period_type = period_processed_arr[f-1].period_type;
							period_processed_arr[f-1].period_type = null;
						}
						if(period_processed_arr[f].processed_date==null||isNaN(period_processed_arr[f].processed_date.from.value)) {
							if(period_processed_arr[f-1].processed_date!=null && period_processed_arr[f-1].processed_date.from.type=='number') {
								period_processed_arr[f].processed_date = period_processed_arr[f-1].processed_date;
								period_processed_arr[f-1].processed_date = null;
							}
							else {
								period_processed_arr[f].processed_date = {from:{value:1,type:'number'}};
							}
						}
					}
				}
			}
		}

		
		//collapse ranges
		var period_arr = [];
		range_processed_arr = [];
		var my_range = new Range();
		for(var f=0; f<period_processed_arr.length; f++)
		{
			//if it's a declaration (not period or range) or a period that's already a range
			//dump the contents of period_arr either into range_processed_arr or my_range if 'from' != [] (then clear my_range and period_arr)
			//if it's a period then write it to range_processed_arr
			if((period_processed_arr[f].word && (
					period_processed_arr[f].type=='starting_declaration'
					/*|| period_processed_arr[f].type=='starting_declaration2'*/
					|| period_processed_arr[f].type=='split_declaration')
					)
				||(period_processed_arr[f].object_type && period_processed_arr[f].object_type=='period' && period_processed_arr[f].is_range()==true)
				||(period_processed_arr[f].object_type && period_processed_arr[f].object_type=='range')) {
				if(my_range.from.length>0) {
					my_range.to = period_arr;
					range_processed_arr[range_processed_arr.length] = my_range;
				} else {
					for(var n =0 ;n<period_arr.length; n++) {
						range_processed_arr[range_processed_arr.length] = period_arr[n];
					}
				}
				if(period_processed_arr[f].object_type)
					range_processed_arr[range_processed_arr.length] = period_processed_arr[f];
				period_arr = [];
				my_range = new Range();
			}
			//if it's a range_declaration then dump the contents of period_arr into my_range.from (then clear period_arr)
			else if(period_processed_arr[f].word && period_processed_arr[f].type=='range_declaration') {
				my_range.from = period_arr;
				period_arr = [];
			}
			else if(period_processed_arr[f].object_type) {
				period_arr[period_arr.length] = period_processed_arr[f];
			}
			//else, if it's a period add it to period_arr

		}
		if(my_range.from.length>0) {
			if(period_arr.length>0){
				my_range.to = period_arr;
				range_processed_arr[range_processed_arr.length] = my_range;
				period_arr = [];
			}
		}
		if(period_arr.length>0) {
			for(var n =0 ;n<period_arr.length; n++) {
				range_processed_arr[range_processed_arr.length] = period_arr[n];
			}
		}
		
		//sort out numbers, times, years
		for(var f=0; f<range_processed_arr.length; f++) {
			if(range_processed_arr[f].object_type) {
				if(range_processed_arr[f].object_type=='range') {
					//get the smallest date type along each arm
					smallest_type_index = range_processed_arr[f].get_smallest_type();
					//smallest_type_index_to = range_processed_arr[f].get_smallest_type('to');
					if(smallest_type_index>0) {
						for(var n=0; n<range_processed_arr[f].from.length; n++) 
							range_processed_arr[f].from[n] = process_number(range_processed_arr[f].from[n],type_order[smallest_type_index].base_type);
						
						for(var n=0; n<range_processed_arr[f].to.length; n++)
							range_processed_arr[f].to[n] = process_number(range_processed_arr[f].to[n],type_order[smallest_type_index].base_type);
						
					}
					
					
				}
				else if(range_processed_arr[f].object_type=='period') {
					
					range_processed_arr[f] = process_number(range_processed_arr[f],'year');
				}
			}

		}

		//sort it out
		for(var f=0; f<range_processed_arr.length; f++) {
			if(range_processed_arr[f].object_type) {
				if(range_processed_arr[f].object_type=='range') {
					range_processed_arr[f].get_largest_type(); //gonna use this later
					range_processed_arr[f].from.sort(sort_by_number);
					range_processed_arr[f].to.sort(sort_by_number);
					range_processed_arr[f].from.sort(sort_by_type);
					range_processed_arr[f].to.sort(sort_by_type);
				}
				else if(range_processed_arr[f].object_type=='period') {
					range_processed_arr[f].get_largest_type();
				}
			}
		}
		range_processed_arr.sort(sort_by_number);
		range_processed_arr.sort(sort_by_type);
		//ballance simple ranges - could be done on the fly
		//find largest types
		//process the fuck out of it
		//if
		/*if(split_period!=null) {
			split_period.get_largest_type();
			range_processed_arr[range_processed_arr.length] = split_period;
		}*/

		var now_date = new Date();
		for(var f=0; f<range_processed_arr.length; f++) {
			if(range_processed_arr[f].object_type) {
				if(range_processed_arr[f].object_type=='period' && range_processed_arr[f].period_modifier=='ago') {
					if(range_processed_arr[f].processed_date && range_processed_arr[f].processed_date.from.type=='number') {
						var thisval = parseInt(range_processed_arr[f].processed_date.from.value);
						switch(range_processed_arr[f].period_type) {
							case 'year':
								now_date = new Date(now_date.getFullYear() - thisval,now_date.getMonth(),now_date.getDate());
								break;
							case 'month':
								now_date = new Date(now_date.getFullYear(),now_date.getMonth() - thisval,now_date.getDate());
								break;
							case 'week':
								now_date =  new Date(now_date.getFullYear(),now_date.getMonth(),now_date.getDate() - (thisval * 7));
								break;
							case 'day':
								now_date =  new Date(now_date.getFullYear(),now_date.getMonth(),now_date.getDate() - (thisval));
								break;
							case 'hour':
								now_date =  new Date(now_date.getFullYear(),now_date.getMonth(),now_date.getDate() - (thisval * 7));
								break;
							case 'minute':
								now_date =  new Date(now_date.getFullYear(),now_date.getMonth(),now_date.getDate() - (thisval * 7));
								break;
							case 'second':
								now_date =  new Date(now_date.getFullYear(),now_date.getMonth(),now_date.getDate() - (thisval * 7));
								break;
						}
					}
					range_processed_arr.splice(f,1);
				}
			}
		}
		var split_pos = -1;
		var dates_count = -1;
		 dates = [[{from:now_date,to:now_date}]];
		//return;
		for(var f=0; f<range_processed_arr.length; f++) {
			if(range_processed_arr[f].object_type) {
				dates_count++;
				dates[dates_count+1] = [];
				if(range_processed_arr[f].object_type=='period') {
					for(var n=0;n<dates[dates_count].length; n++) {
						var dates_len = dates[dates_count+1].length;
						var this_dr = process_period(range_processed_arr[f],dates[dates_count][n],null,null);
						
						if(!this_dr.length>0) {
							if(this_dr && this_dr.from!=null && this_dr.to!=null && this_dr.from!='Invalid Date' && this_dr.to!='Invalid Date')				dates[dates_count+1][dates_len] = this_dr;
						} else {
							for(var j=0;j<this_dr.length;j++) {
								var dates_len = dates[dates_count+1].length;
								dates[dates_count+1][dates_len] = this_dr[j];
							}
							//this_dr.concat(dates[dates_count+1]);
						}
					}
					//if it just has a period_type and maybe a number then it's probably the split
					if(	range_processed_arr[f].period_specifier==null &&
						range_processed_arr[f].period_modifier==null &&
						range_processed_arr[f].n_value==null &&
						range_processed_arr[f].needs_start()==true &&
						range_processed_arr[f].period_type!=null &&
						(range_processed_arr[f].processed_date==null ||
						range_processed_arr[f].processed_date.from.type=='number')) 
					{
						split_pos = dates_count+1;
					}
						
				}
				else if(range_processed_arr[f].object_type=='range') {
					//find the arm with most info, process that first
					//new plan, make both arms the same length, ie. add larger period types from one arm to the other
					var longest = range_processed_arr[f].largest_arm;
					var shortest = range_processed_arr[f].shortest_arm;
					var shortest_type = range_processed_arr[f].get_largest_type_for_arm(shortest);
					for(var n=0;n<range_processed_arr[f][longest].length; n++) {
						if(Math.floor(range_processed_arr[f][longest][n].largest_type/2)>(shortest_type/2)) {
							var shortest_length = range_processed_arr[f][shortest].length;
							range_processed_arr[f][shortest][shortest_length] = jQuery.extend(true, {}, range_processed_arr[f][longest][n]);
						}
					}
					range_processed_arr[f].from.sort(sort_by_number);
					range_processed_arr[f].to.sort(sort_by_number);
					range_processed_arr[f].from.sort(sort_by_type);
					range_processed_arr[f].to.sort(sort_by_type);
					
					var arm = 'from';
					var tmp_dates = {from:[],to:[]}; //this could also be done a lot nicer
					for(var n=0;n<dates[dates_count].length; n++) {
						var range_dr = new DateRange();
						var tmp_dates_count = -1;
						tmp_dates[arm] = [];
						tmp_dates[arm][0] = [dates[dates_count][n]];						
						for(var a=0; a<range_processed_arr[f][arm].length; a++) {
							tmp_dates[arm][a+1] = [];
							for(var b=0; b<tmp_dates[arm][a].length; b++) {
								var this_dr = process_period(range_processed_arr[f][arm][a],tmp_dates[arm][a][b],null,null);
								if(!this_dr.length>0) {
									if(this_dr && this_dr.from!=null && this_dr.to!=null && this_dr.from!='Invalid Date' && this_dr.to!='Invalid Date')				tmp_dates[arm][a+1][b] = this_dr;
									else
										tmp_dates[arm][a+1][b] = null;
								} else {
									for(var j=0;j<this_dr.length;j++) {
										var dates_len = tmp_dates[arm][a+1].length;
										tmp_dates[arm][a+1][dates_len] = this_dr[j];
									}
									//this_dr.concat(dates[dates_count+1]);
								}
							}
						}
						//get the date
						//var working_date = tmp_dates[tmp_dates.length-1][0].from;
						//range_dr[arm] = working_date;
						//do it all again for the other arm
						arm = 'to';
						tmp_dates[arm][0] = [dates[dates_count][n]];						
						for(var a=0; a<range_processed_arr[f][arm].length; a++) {
							tmp_dates[arm][a+1] = [];
							for(var b=0; b<tmp_dates[arm][a].length; b++) {
								var this_dr = process_period(range_processed_arr[f][arm][a],tmp_dates[arm][a][b],null,null);
								if(!this_dr.length>0) {
									if(this_dr && this_dr.from!=null && this_dr.to!=null && this_dr.from!='Invalid Date' && this_dr.to!='Invalid Date')				tmp_dates[arm][a+1][b] = this_dr;
									else
										tmp_dates[arm][a+1][b] = null;
								} else {
									for(var j=0;j<this_dr.length;j++) {
										var dates_len = tmp_dates[arm][a+1].length;
										tmp_dates[arm][a+1][dates_len] = this_dr[j];
									}
									//this_dr.concat(dates[dates_count+1]);
								}
							}
						}
						var no_froms = tmp_dates.from.length - 1;
						var no_tos = tmp_dates.to.length - 1;
						for(var a=0; a<tmp_dates.from[no_froms].length; a++) {
							if(tmp_dates.from[no_froms][a]!=null&&tmp_dates.to[no_tos][a]!=null) {
								var range_dr = new DateRange();
								range_dr.from = tmp_dates.from[no_froms][a].from;
								if(!INCLUSIVE)
									range_dr.to = tmp_dates.to[no_tos][a].from;
								else
									range_dr.to = tmp_dates.to[no_tos][a].to;
								var dates_len = dates[dates_count+1].length;
								dates[dates_count+1][dates_len] = range_dr;
							}
						}
					}
				}
			}
		}
		if(split_pos==-1) split_pos = dates.length-1;

		var json = "{text:'" + last_text.replace("'"," ") + "',dates:[";
        var out = {text:last_text.replace("'",""), dates:[]};
		$.each(dates[dates.length-1],function(i) {
			if(this.from>this.to) {
				var tmpdate = this.from;
				this.from = this.to;
				this.to = tmpdate;
			}
			if(i>0) json += ",";
			var year = this.from.getFullYear();
			var month = this.from.getMonth() + 1;
			var date = this.from.getDate();
			var hours = this.from.getHours();
			var minutes = this.from.getMinutes();
			if(minutes<10) minutes = "0" + minutes;
			json += "{from:'" + year + "-" + month + "-" + date + " " + hours + ":" + minutes + "',";
            
			year = this.to.getFullYear();
			month = this.to.getMonth() + 1;
			date = this.to.getDate();
			hours = this.to.getHours();
			minutes = this.to.getMinutes();
			if(minutes<10) minutes = "0" + minutes;
			if(hours<10) hours = "0" + hours;
			json += "to:'" + year + "-" + month + "-" + date + " " + hours + ":" + minutes + "'}";
            
            out.dates.push({from:this.from,to:this.to});
		});
		json += "]";
		if(split_pos!=dates.length-1) {
			json += ",split_dates:[";
            out.splitDates = [];
			$.each(dates[split_pos],function(i) {
				if(this.from>this.to) {
					var tmpdate = this.from;
					this.from = this.to;
					this.to = tmpdate;
				}
				if(i>0) json += ",";
				var year = this.from.getFullYear();
				var month = this.from.getMonth() + 1;
				var date = this.from.getDate();
				var hours = this.from.getHours();
				var minutes = this.from.getMinutes();
				if(minutes<10) minutes = "0" + minutes;
				json += "{from:'" + year + "-" + month + "-" + date + " " + hours + ":" + minutes + "',";
				year = this.to.getFullYear();
				month = this.to.getMonth() + 1;
				date = this.to.getDate();
				hours = this.to.getHours();
				minutes = this.to.getMinutes();
				if(minutes<10) minutes = "0" + minutes;
				if(hours<10) hours = "0" + hours;
				json += "to:'" + year + "-" + month + "-" + date + " " + hours + ":" + minutes + "'}";
                
                out.splitDates.push({from:this.from,to:this.to});
			});
			json += "]";
		}
		json += "}";
		
/*		var outtext = "";
		outtext += "<h3>" + range_processed_arr.length + "</h3><div id=\"u1\">";
		outtext += "</div><div id=\"u3\"><h4>date processed</h4>";
		
		$.each(dates[split_pos],function() {
			outtext += "<br />" + (this.from + "").replace(/ GMT.*$/,"") + " - " + (this.to+"").replace(/ GMT.*$/,"");
		});
		outtext += "</div><div id=\"u3\"><h4>period processed</h4>";
		$.each(period_processed_arr,function(){
			if(this.word) {
				outtext += "<br />{word:'" + this.word + "',type:'" + this.type + "'}";
			}
			else {
				if(typeof(this)=='object'&&this.object_type&&this.object_type=='period'){
							outtext += "<br>{period:";
							if(this.period_specifier) outtext += "<br>period_specifier:" + this.period_specifier;
							if(this.period_type) outtext += "<br>,period_type:" + this.period_type;
							if(this.processed_date) outtext += "<br>,processed_date.from.value:" + this.processed_date.from.value;
							if(this.processed_date) outtext += "<br>,processed_date.from.type:" + this.processed_date.from.type;
							if(this.processed_date&&this.processed_date.to) outtext += "<br>,processed_date.to.value:" + this.processed_date.to.value;
							if(this.processed_date&&this.processed_date.to) outtext += "<br>,processed_date.to.type:" + this.processed_date.to.type;
							if(this.period_modifier) outtext += "<br>,period_modifier:" + this.period_modifier;
							if(this.n_value) outtext += "<br>,n_value:" + this.n_value;
							if(this.starting_specifier) outtext += "<br>,starting_specifier:" + this.starting_specifier;
							if(this.starting_type) outtext += "<br>,starting_type:" + this.starting_type;
							if(this.starting_date) outtext += "<br>,starting_date.from.value:" + this.starting_date.from.value;
							if(this.starting_date) outtext += "<br>,starting_date.from.type:" + this.starting_date.from.type;
							if(this.starting_date&&this.starting_date.to) outtext += "<br>,starting_date.to.value:" + this.starting_date.to.value;
							if(this.starting_date&&this.starting_date.to) outtext += "<br>,starting_date.to.type:" + this.starting_date.to.type;
							
							if(this.starting_modifier) outtext += "<br>,starting_modifier:" + this.starting_modifier;
					outtext += "}";
				}
			}

		});
		outtext += "</div><div id=\"u3\"><h4>word processed</h4>";
		$.each(date_processed_arr,function(){
				outtext += "<br />{word:'" + this.word + "',type:'" + this.type + "'}";
		});
		outtext += "</div><div id=\"u2\"><h4>words extracted</h4>";
		$.each(outarr,function(){
			outtext += "<br />{word:'" + this.word + "',type:'" + this.type + "'}";
		});
		outtext += "</div>";
		$('#output').html(outtext);
	*/
        if(out.dates && out.dates.length > 0) {
		  return out.dates[0].from;
        }
        else {
            return null;   
        }
	}
	var dates; //REMEMBER TO MOVE THIS BACK INDOORS WHERE IT BELONGS!!!!!!
	function process_period(period,current_range,other_date,range_part) {
		if(current_range==null) return {from:null,to:null};
		if(range_part!=null) {
			current_range = {from:range_part,to:range_part};
		}
		if(current_range.to<current_range.from) {
			var tmp = current_range.to;
			current_range.to = current_range.from
			current_range.from = tmp;
		}
		var dr = new DateRange();
		var out_arr = []; //for range use
		var period_type = null;
		period_type = type_order[Math.floor(period.largest_type/2)].value;
		var period_length = 1;
		var n_value = parseInt(period.n_value);
		if(period.processed_date && period.processed_date.from.type=='number') {
			period_length = parseInt(period.processed_date.from.value);
		}
		if(period.needs_start()==false) current_range = {from:new Date(),to:new Date()};
		switch(period_type) {
			case "year":
				var first_date = new Date(current_range.from.getFullYear(),0,1);	//get first occurance of a year in this period				
				var last_date = new Date(current_range.to.getFullYear(),0,1);
				while(last_date>=current_range.to) {
					last_date = new Date(last_date.getFullYear()-1,0,1);
				}
				if(period.is_range()==false && period.processed_date && (period.processed_date.from.type=='year' || (period.period_specifier==null && period.processed_date.from.type=='number'))) {
					
					var year = parseInt(period.processed_date.from.value);
					if(year<50) year += 2000;
					else if(year<100) year += 1900;
					dr.from = new Date(year,0,1);
					dr.to = new Date(year+1,0,1);
				}
				else {
				
					switch(period.period_specifier) {
						case "this":
							if(current_range) {
								dr.from = first_date;
								dr.to = new Date(first_date.getFullYear()+period_length,0,1);
							}
							break;
						case "last":
							if(current_range) {
								dr.to = last_date;
								dr.from = new Date(last_date.getFullYear() - period_length, 0,1);
							}
							break;
						case "next":
							if(current_range) {
								dr.from = new Date(last_date.getFullYear()+1,0,1);
								dr.to = new Date(last_date.getFullYear() + 1 + period_length, 0,1);
							}
							break;
						case "nth":
							if(current_range) {
								dr.from = new Date(first_date.getFullYear() + (period_length * (n_value-1)),0,1);
								dr.to = new Date(first_date.getFullYear() + (period_length * n_value),0,1);
							}
							break;
						case "every":
						case null:
							if(current_range) {
								while(first_date<=last_date) {
									var tr = new DateRange();
									tr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate());
									tr.to = new Date(first_date.getFullYear()+period_length,first_date.getMonth(),first_date.getDate());
									out_arr[out_arr.length] = tr;
									first_date = new Date(first_date.getFullYear()+period_length,first_date.getMonth(),first_date.getDate());
								}
							}							
							break;
					}
				}

				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;
			case "month":
				var first_date = new Date(current_range.from.getFullYear(),current_range.from.getMonth(),1);	//get first occurance of a year in this period
				
				var last_date = new Date(current_range.to.getFullYear(),current_range.to.getMonth(),1);
				/*while(last_date>=current_range.to) {
					last_date = new Date(last_date.getFullYear(),last_date.getMonth()-1,1);
				}*/
				if((period.is_range()==false && period.processed_date && period.processed_date.from.type=='month')
					||(period.period_type=='month' && period.period_specifier==null && period.processed_date && period.processed_date.from.type=='number')) {
					
					var month = parseInt(period.processed_date.from.value);
					month--;
					if(month<12) {
						if(current_range.from==current_range.to) { //this could be done more elegantly, given some fucking time
							var tr = new DateRange();
							tr.from = new Date(first_date.getFullYear(),month,1);
							tr.to = new Date(first_date.getFullYear(),month+1,1);
							out_arr[out_arr.length] = tr;
							first_date = new Date(first_date.getFullYear()+1,month,1);
						}
						else {
							while(first_date<last_date) {
								var tr = new DateRange();
								tr.from = new Date(first_date.getFullYear(),month,1);
								tr.to = new Date(first_date.getFullYear(),month+1,1);
								out_arr[out_arr.length] = tr;
								first_date = new Date(first_date.getFullYear()+1,month,1);
							}
						}
					}
				}
				else {
				
					switch(period.period_specifier) {
						case "this":
							if(current_range) {
								dr.from = first_date;
								dr.to = new Date(first_date.getFullYear(),first_date.getMonth()+period_length,1);
							}
							break;
						case "last":
							if(current_range) {
								dr.to = last_date;
								dr.from = new Date(last_date.getFullYear(),last_date.getMonth() - period_length,1);
							}
							break;
						case "next":
							if(current_range) {
								dr.from = new Date(last_date.getFullYear(),last_date.getMonth()+1,1);
								dr.to = new Date(last_date.getFullYear(), last_date.getMonth() + 1 + period_length,1);
							}
							break;
						case "nth":
							if(current_range) {
								dr.from = new Date(first_date.getFullYear(), first_date.getMonth() + (period_length * (n_value-1)),1);
								dr.to = new Date(first_date.getFullYear(),first_date.getMonth() + (period_length * n_value),1);
							}
							break;
						case "every":
						case null:
							if(current_range) {
								while(first_date<last_date) {
									var tr = new DateRange();
									tr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate());
									tr.to = new Date(first_date.getFullYear(),first_date.getMonth()+period_length,first_date.getDate());
									out_arr[out_arr.length] = tr;
									first_date = new Date(first_date.getFullYear(),first_date.getMonth()+period_length,first_date.getDate());
								}
							}
							break;
					}
				}
				
				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;
			case "week":
				var first_date = new Date(current_range.from.getFullYear(),current_range.from.getMonth(),current_range.from.getDate());	//get first occurance of a year in this period
				while(first_date.getDay()!=week_start_day) {
					first_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()-1);
				}
				var last_date;
				if(current_range.from==current_range.to)
					last_date = first_date;
				else
					last_date = new Date(current_range.to.getFullYear(),current_range.to.getMonth(),current_range.to.getDate()-1);
				while(last_date.getDay()!=week_start_day) {
					last_date = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate()+1);
				}
				if(
					(period.is_range()==false && period.processed_date && period.processed_date.from.type=='week') ||
					(period.period_specifier==null && period.processed_date!=null && period.processed_date.from.type=='number')
				) {
					
					var week = parseInt(period.processed_date.from.value);
					if(current_range.from==current_range.to) {
						dr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + ((week-1)*7));
						dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + ((week)*7));
					}
					else {
						while(first_date<last_date) {
							var tr =new DateRange();
							tr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + ((week-1)*7));
							tr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + ((week)*7));
							out_arr[out_arr.length] = tr;
							first_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + 7);
						}
					}
				}
				else {
				
					switch(period.period_specifier) {
						case "this":
							if(current_range) {
								dr.from = first_date;
								dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + (7*period_length));
							}
							break;
						case "last":
							if(current_range) {
								dr.to = last_date;
								dr.from = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate() - (7*period_length));
							}
							break;
						case "next":
							if(current_range) {
								dr.from = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate() + (7*period_length));
								dr.to = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate() + (7*(period_length+1)));
							}
							break;
						case "nth":
							if(current_range) {
								dr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + ((period_length*7) * (n_value-1)));
								dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + ((period_length*7) * (n_value)));
							}
							break;
						case "every":
						case null:
							if(current_range) {
								while(first_date<last_date) {
									var tr = new DateRange();
									tr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate());
									tr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+(7 * period_length));
									out_arr[out_arr.length] = tr;
									first_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+(7*period_length));
								}
							}
							break;
					}
				}

				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;
			case "day_name":
				//TODO, if from and to are the same then pass it this week's dates
				if(current_range.from==current_range.to) {
					while(current_range.from.getDay()!=week_start_day) {
						current_range.from = new Date(current_range.from.getFullYear(),current_range.from.getMonth(),current_range.from.getDate()-1);
					}
					while(current_range.to.getDay()!=week_start_day) {
						current_range.to = new Date(current_range.to.getFullYear(),current_range.to.getMonth(),current_range.to.getDate()+1);
					}
				}
				var day_name = 0;
				if(period.is_range()==false && period.processed_date && period.processed_date.from.type=='day_name') {
					day_name = parseInt(period.processed_date.from.value);
					if(day_name>6) day_name-=7;
				}
				var first_date = new Date(current_range.from.getFullYear(),current_range.from.getMonth(),current_range.from.getDate());
				//go to the first sunday in the period then 
				while(first_date.getDay()!=0)
					first_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()-1);
				while(first_date.getDay()!=day_name)
					first_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+1);
				var last_date = new Date(current_range.to.getFullYear(),current_range.to.getMonth(),current_range.to.getDate()-1);
				while(last_date.getDay()!=day_name)
					last_date = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate()-1);
				switch(period.period_specifier) {
					case "this":
						if(current_range) {
							dr.from = first_date;
							dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + 1);
						}
						break;
					case "last":
						if(current_range) {
							dr.from = last_date;
							dr.to = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate() + 1);
						}
						break;
					case "next":
						if(current_range) {
							dr.from = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate() + 7);
							dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + 8);
						}
						break;
					case "nth":
						if(current_range) {
							dr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + (7 * (n_value-1)));
							dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + (7 * (n_value-1)) + 1);
						}
						break;
					case "every":
					case null:
						if(current_range) {
							while(first_date<=last_date) {
								if(first_date>=current_range.from&&first_date<current_range.to) {
									var tr = new DateRange();
									tr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate());
									tr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+1);
									out_arr[out_arr.length] = tr;
								}
								first_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+(7 * period_length));
							}
						}
						break;
				}
				
			
				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;
			case "day":
		
				var first_date = new Date(current_range.from.getFullYear(),current_range.from.getMonth(),current_range.from.getDate());	//get first occurance of a year in this period
				
				var last_date = new Date(current_range.to.getFullYear(),current_range.to.getMonth(),current_range.to.getDate());
		
				if(period.is_range()==false && period.processed_date && ((period.processed_date.from.type=='number' && period.period_specifier==null)
					||(period.processed_date.from.type=='day' && period.period_specifier==null))) {
					var day = parseInt(period.processed_date.from.value);
					if(current_range.from==current_range.to) {
						dr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+day-1);
						dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+day);
					}
					else {
						while(first_date<last_date) {
							var tr =new DateRange();
							tr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+day-1);
							tr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+day);
							out_arr[out_arr.length] = tr;
							first_date = new Date(first_date.getFullYear(),first_date.getMonth()+1,first_date.getDate());
						}
					}
				}
				else {
				
					switch(period.period_specifier) {
					case "this":
						if(current_range) {
							dr.from = first_date;
							dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + period_length);
						}
						break;
					case "last":
						if(current_range) {
							dr.to = last_date;
							dr.from = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate() - period_length);
						}
						break;
					case "next":
						if(current_range) {
							dr.from = new Date(last_date.getFullYear(),last_date.getMonth(),last_date.getDate() + 1);
							dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + 1 + period_length);
						}
						break;
					case "nth":
						if(current_range) {
							dr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + (period_length * (n_value-1)));
							dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + (period_length * (n_value)));
						}
						break;
					case "every":
					case null:
						if(current_range) {
								while(first_date<last_date) {
									var tr = new DateRange();
									tr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate());
									tr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+period_length);
									out_arr[out_arr.length] = tr;
									first_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate()+period_length);
								}
							}
						break;
					}
				}
				
				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;
			case "time":
				
				var first_date = new Date(current_range.from.getFullYear(),current_range.from.getMonth(),current_range.from.getDate());	//get first occurance of a year in this period
				
				var last_date = new Date(current_range.to.getFullYear(),current_range.to.getMonth(),current_range.to.getDate());
				
				if(period.is_range()==false && period.processed_date && period.processed_date.from.type=='time') {
					period.processed_date.from.value = period.processed_date.from.value.toString();
					var timemat = period.processed_date.from.value.match(/([0-9]+):([0-9]+)/);
					if(timemat!=null) {
						var hours = parseInt(timemat[1]);
						var mins = parseInt(timemat[2]);
						var to_hours = hours;
						var to_mins = mins;
						if(mins==0)
							to_hours = hours+1;
						else
							to_mins = mins + 1;
						if(current_range.from==current_range.to) {
							dr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate(),hours,mins);
							dr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate(),to_hours,to_mins);
						}
						else {
							while(first_date<last_date) {
								var tr =new DateRange();
								tr.from = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate(),hours,mins);
								tr.to = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate(),to_hours,to_mins);
								out_arr[out_arr.length] = tr;
								first_date = new Date(first_date.getFullYear(),first_date.getMonth(),first_date.getDate() + 1);
							}
						}
					
					}
				}
				else {
				
					switch(period.period_specifier) {
						case "this":
							if(current_range) {
								dr.from = first_date;
								dr.to = new Date(first_date.getFullYear()+period_length,0,1);
							}
							break;
						case "last":
							if(current_range) {
								dr.to = last_date;
								dr.from = new Date(last_date.getFullYear() - period_length, 0,1);
							}
							break;
						case "next":
							if(current_range) {
								dr.from = new Date(last_date.getFullYear()+1,0,1);
								dr.to = new Date(last_date.getFullYear() + 1 + period_length, 0,1);
							}
							break;
						case "nth":
							if(current_range) {
								dr.from = new Date(first_date.getFullYear() + (period_length * (n_value-1)),0,1);
								dr.to = new Date(first_date.getFullYear() + (period_length * n_value),0,1);
							}
							break;
						case "every":
						case "":

							break;
					}
				}

				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;
			case "hour":
				var first_date = new Date(current_range.from.getFullYear(),0,1);	//get first occurance of a year in this period
				
				var last_date = new Date(current_range.to.getFullYear(),0,1);
				while(last_date>=current_range.to) {
					last_date = new Date(last_date.getFullYear()-1,0,1);
				}
				if(period.is_range()==false && period.processed_date && period.processed_date.from.type=='time') {
					
					var year = parseInt(period.processed_date.from.value);
					if(year<50) year += 2000;
					else if(year<100) year += 1900;
					dr.from = new Date(year,0,1);
					dr.to = new Date(year+1,0,1);
				}
				else {
				
					switch(period.period_specifier) {
						case "this":
							if(current_range) {
								dr.from = first_date;
								dr.to = new Date(first_date.getFullYear()+period_length,0,1);
							}
							break;
						case "last":
							if(current_range) {
								dr.to = last_date;
								dr.from = new Date(last_date.getFullYear() - period_length, 0,1);
							}
							break;
						case "next":
							if(current_range) {
								dr.from = new Date(last_date.getFullYear()+1,0,1);
								dr.to = new Date(last_date.getFullYear() + 1 + period_length, 0,1);
							}
							break;
						case "nth":
							if(current_range) {
								dr.from = new Date(first_date.getFullYear() + (period_length * (n_value-1)),0,1);
								dr.to = new Date(first_date.getFullYear() + (period_length * n_value),0,1);
							}
							break;
						case "every":
						case "":

							break;
					}
				}

				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;
			case "minute":
				var dr = new DateRange();
				var from = []; //for range use
				var to = []; //ditto
				var period_length = 1;
				var n_value = parseInt(period.n_value);
				if(period.processed_date && period.processed_date.from.type=='number') {
					period_length = parseInt(period.processed_date.from.value);
				}
				var first_date = new Date(current_range.from.getFullYear(),0,1);	//get first occurance of a year in this period
				
				var last_date = new Date(current_range.to.getFullYear(),0,1);
				while(last_date>=current_range.to) {
					last_date = new Date(last_date.getFullYear()-1,0,1);
				}
				if(period.is_range()==false && period.processed_date && period.processed_date.from.type=='year') {
					
					var year = parseInt(period.processed_date.from.value);
					if(year<50) year += 2000;
					else if(year<100) year += 1900;
					dr.from = new Date(year,0,1);
					dr.to = new Date(year+1,0,1);
				}
				else {
				
					switch(period.period_specifier) {
						case "this":
							if(current_range) {
								dr.from = first_date;
								dr.to = new Date(first_date.getFullYear()+period_length,0,1);
							}
							break;
						case "last":
							if(current_range) {
								dr.to = last_date;
								dr.from = new Date(last_date.getFullYear() - period_length, 0,1);
							}
							break;
						case "next":
							if(current_range) {
								dr.from = new Date(last_date.getFullYear()+1,0,1);
								dr.to = new Date(last_date.getFullYear() + 1 + period_length, 0,1);
							}
							break;
						case "nth":
							if(current_range) {
								dr.from = new Date(first_date.getFullYear() + (period_length * (n_value-1)),0,1);
								dr.to = new Date(first_date.getFullYear() + (period_length * n_value),0,1);
							}
							break;
						case "every":
						case "":

							break;
						
					}
				}


				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;
			case "second":
				var dr = new DateRange();
				var from = []; //for range use
				var to = []; //ditto
				var period_length = 1;
				var n_value = parseInt(period.n_value);
				if(period.processed_date && period.processed_date.from.type=='number') {
					period_length = parseInt(period.processed_date.from.value);
				}
				var first_date = new Date(current_range.from.getFullYear(),0,1);	//get first occurance of a year in this period
				
				var last_date = new Date(current_range.to.getFullYear(),0,1);
				while(last_date>=current_range.to) {
					last_date = new Date(last_date.getFullYear()-1,0,1);
				}
				if(period.is_range()==false && period.processed_date && period.processed_date.from.type=='year') {
					
					var year = parseInt(period.processed_date.from.value);
					if(year<50) year += 2000;
					else if(year<100) year += 1900;
					dr.from = new Date(year,0,1);
					dr.to = new Date(year+1,0,1);
				}
				else {
				
					switch(period.period_specifier) {
						case "this":
							if(current_range) {
								dr.from = first_date;
								dr.to = new Date(first_date.getFullYear()+period_length,0,1);
							}
							break;
						case "last":
							if(current_range) {
								dr.to = last_date;
								dr.from = new Date(last_date.getFullYear() - period_length, 0,1);
							}
							break;
						case "next":
							if(current_range) {
								dr.from = new Date(last_date.getFullYear()+1,0,1);
								dr.to = new Date(last_date.getFullYear() + 1 + period_length, 0,1);
							}
							break;
						case "nth":
							if(current_range) {
								dr.from = new Date(first_date.getFullYear() + (period_length * (n_value-1)),0,1);
								dr.to = new Date(first_date.getFullYear() + (period_length * n_value),0,1);
							}
							break;
						case "every":
						case "":

							break;
					}
				}

				//if it's a simple range get the dates
				//if processed_date.from.type=='year' then get the dates for that year
				//now start looking at the period specifier
				break;

		}
		if(out_arr.length>0 && (dr.from==null && dr.to==null)) return out_arr;
		else return dr;
	}
	function split_complex_types(complex_type,splice_arr,add_arr,f,period,arm) {
		switch(complex_type.type) {
		case "full_date":
			var bit_match = complex_type.value.match(/^([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)[^0-9]*([0-9:]*)/);
			if(bit_match!=null) {
				var day_period = new Period();
				day_period.period_type = 'day';
				day_period.processed_date = {from:{value:bit_match[3],type:'number'}};
				var month_period = new Period();
				month_period.period_type = 'month';
				month_period.processed_date = {from:{value:bit_match[2],type:'number'}};
				var year_period = new Period();
				year_period.processed_date = {from:{value:bit_match[1],type:'year'}};
				var time_period = null;
				if(bit_match[4]!="") {
					time_period = new Period();
					time_period.period_type = 'time';
					time_period.processed_date = {from:{value:bit_match[4],type:'time'}};
				}
				if(add_arr!=null) {
					if(time_period!=null)
						add_arr.splice(0,0,day_period,month_period,year_period,time_period);
					else
						add_arr.splice(0,0,day_period,month_period,year_period);
					if(splice_arr!=null) splice_arr.splice(f,1);
				}
				else if(splice_arr!=null) 
					if(time_period!=null)
						splice_arr.splice(f,1,day_period,month_period,year_period,time_period);
					else
						splice_arr.splice(f,1,day_period,month_period,year_period);
				
			}
			break;
		case "day_name_month":
			var bit_match = complex_type.value.match(/^([0-9]+)[^0-9]+([0-9]+)/);
			if(bit_match!=null) {
				var bit_period = new Period();
				bit_period.period_type = 'day_name';
				bit_period.processed_date = {from:{value:bit_match[1],type:'number'}};
				var month_period = new Period();
				month_period.period_type = 'month';
				month_period.processed_date = {from:{value:bit_match[2],type:'number'}};
				if(add_arr!=null) {
					add_arr.splice(0,0,bit_period,month_period);
					if(splice_arr!=null) splice_arr.splice(f,1);
				}
				else if(splice_arr!=null) splice_arr.splice(f,1,bit_period,month_period);
				
			}
			break;
		case "day_month":
			var bit_match = complex_type.value.match(/^([0-9]+)[^0-9]+([0-9]+)/);
			if(bit_match!=null) {
				var bit_period = new Period();
				bit_period.period_type = 'day';
				bit_period.processed_date = {from:{value:bit_match[1],type:'number'}};
				var month_period = new Period();
				month_period.period_type = 'month';
				month_period.processed_date = {from:{value:bit_match[2],type:'number'}};
				if(add_arr!=null) {
					add_arr.splice(0,0,bit_period,month_period);
					if(splice_arr!=null) splice_arr.splice(f,1);
				}
				else 
				if(splice_arr!=null) splice_arr.splice(f,1,bit_period,month_period);
				
			}
			break;
		case "day_name_month_year":
			var bit_match = complex_type.value.match(/^([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+)/);
			if(bit_match!=null) {
				var bit_period = new Period();
				bit_period.period_type = 'day_name';
				bit_period.processed_date = {from:{value:bit_match[1],type:'number'}};
				var month_period = new Period();
				month_period.period_type = 'month';
				month_period.processed_date = {from:{value:bit_match[2],type:'number'}};
				var year_period = new Period();
				year_period.processed_date = {from:{value:bit_match[3],type:'year'}};
				if(add_arr!=null) {
					add_arr.splice(0,0,bit_period,month_period,year_period);
					if(splice_arr!=null) splice_arr.splice(f,1);
				}
				else 
				if(splice_arr!=null) splice_arr.splice(f,1,bit_period,month_period,year_period);
				
			}
			break;
		case "day_name_year":
			var bit_match = complex_type.value.match(/^([0-9]+)[^0-9]+([0-9]+)/);
			if(bit_match!=null) {
				var bit_period = new Period();
				bit_period.period_type = 'day_name';
				bit_period.processed_date = {from:{value:bit_match[1],type:'number'}};
				var year_period = new Period();
				year_period.processed_date = {from:{value:bit_match[2],type:'year'}};
				if(add_arr!=null) {
					add_arr.splice(0,0,bit_period,year_period);
					if(splice_arr!=null) splice_arr.splice(f,1);
				}
				else 
				if(splice_arr!=null) splice_arr.splice(f,1,bit_period,year_period);
				
			}
			break;
		case "month_year":
			var bit_match = complex_type.value.match(/^([0-9]+)[^0-9]+([0-9]+)/);
			if(bit_match!=null) {
				var month_period = new Period();
				month_period.period_type = 'month';
				month_period.processed_date = {from:{value:bit_match[1],type:'number'}};
				var year_period = new Period();
				year_period.processed_date = {from:{value:bit_match[2],type:'year'}};
				if(add_arr!=null) {
					add_arr.splice(0,0,month_period,year_period);
					if(splice_arr!=null) splice_arr.splice(f,1);
				}
				else 
				if(splice_arr!=null) splice_arr.splice(f,1,month_period,year_period);
				
			}
			break;
		default:
			if(add_arr!=null) {
				var new_period = new Period();
				new_period.period_type = period.period_type;//period.processed_date[arm].type;
				new_period.processed_date = {from:period.processed_date[arm]};
				add_arr.splice(0,0,new_period);
				if(splice_arr!=null) splice_arr.splice(f,1);
			}
			break;
		}
		return {splice_arr:splice_arr,add_arr:add_arr};
		//if(splice_arr!=null) return splice_arr;
		//if(add_arr!=null) return add_arr;
	}
	function get_date_range(period,dates,now_date) {
		//returns all occurances of a date in the region
	}
	function process_number(period,preferred_type) {
		period.get_smallest_type();
		period.get_largest_type();
		if(period.object_type &&
			period.period_type == null &&
			period.period_specifier == null &&
			period.processed_date !=null &&
			period.processed_date.from.type == 'number') {
			var year = parseInt(period.processed_date.from.value);
			if(year>1800 && year <4000) {
				period.processed_date.from.value = year;
				period.processed_date.from.type = 'year';
				return period;
			}
			switch(preferred_type){
				case 'time':
					if(year<25) {
						period.processed_date.from.value = year;
						period.processed_date.from.type = 'time';
					}
					break;
				case 'day':
					if(year<32) {
						period.processed_date.from.value = year;
						period.processed_date.from.type = 'day';
					}
					break;
				case 'month':
					if(year<13){
						period.processed_date.from.value = year;
						period.processed_date.from.type = 'month';
					}
					break;
				case 'year':
					if(year<50) year += 2000;
					else if(year<100) year += 1900;
					period.processed_date.from.value = year;
					period.processed_date.from.type = 'year';
				break;
			}
		}
		return period;
	}
	function send_to_date_processor(thisbit,lastbit,date_processed_arr) {
	
		//here's the challenge
		//the last few bits in thisbit could be 'special', these should be added to the output array
		//but.... 1st etc is special and may or may not be used in the date, if it isn't used then it should be sent back
		//or should it have been sent in the first place?
		if(thisbit.length>0) {
			var testbit = "";
			var thisbit_length = thisbit.length;
			if(lastbit=='special') thisbit_length-=1;
			if(thisbit_length>0) {
				for(var t=0; t<thisbit_length; t++) {
					testbit += thisbit[t].bit.value;
				}
				//document.title = testbit;
				var date = interpret_date(testbit,'');
				if(date.error) {
					for(var d=0; d<thisbit.length; d++) {
						date_processed_arr[date_processed_arr.length] = thisbit[d].bit;
					}
				}else {
					if(date.from.value!=null) {
						if(!date.to&&date.from.type=='period_specifier_number')
							date_processed_arr[date_processed_arr.length] = {word:'st',value:date.from.value,type:date.from.type};
						else
							date_processed_arr[date_processed_arr.length] = {word:'date',value:date,type:'processed_date'};
						if(lastbit=='special') date_processed_arr[date_processed_arr.length] = thisbit[thisbit.length-1].bit;
					}
					else {
						//couldn't extract anything, send all the bits to the processor seperately
						$.each(thisbit,function(){
							date = interpret_date(this.bit.value,'');
							if(date.error||date.from.value==null||isNaN(date.from.value)) date_processed_arr[date_processed_arr.length] = this.bit;
							else {
								if(!date.to&&date.from.type=='period_specifier_number')
									date_processed_arr[date_processed_arr.length] = {word:'st',value:date.from.value,type:date.from.type};
								else
									date_processed_arr[date_processed_arr.length] = {word:'date',value:date,type:'processed_date'};
							}
						});
					}
				}
			}
			
		}
		return date_processed_arr;
	}
	function extract_words(text) {
		var outarr = [];
		while(text.length>0) {
			var thisout = null;
			text = text.replace(/^\s+|\s+$/gi,''); //trim
			
			if(thisout==null) {
				//try month names
				for (var f=0; f<months.length; f++)
				{
					var re = new RegExp("^" + months[f] + "[a-z]*", "i");
					if(text.match(re)!=null) {
						thisout = {word:months[f],value:" " + months[f] + " ",type:'month_name'};
						text = text.replace(re,'');
						break;
					}
				}
			}
			
			if(thisout==null) {
				//is it a positional number?
				var m = text.match(/^([0-9]+)st/i);
				if(m!=null) {
					thisout = {word:'st',value:" " + m[1] + 'st ',type:'period_specifier_number'};
					text = text.replace(/^[0-9]+st/i,'');
				}
			}
			if(thisout==null) {
				//is it a regular number?
				var m = text.match(/^([0-9]+)\b/i);
				if(m!=null) {
					thisout = {word:m[1],value:" " +m[1]+ " ",type:'number'};
					text = text.replace(/^[0-9]+\b/i,'');
				}
			}
			if(thisout==null){
				for (var f=0; f<word_list.length; f++)
				{
					var re = new RegExp("^" + word_list[f].word, "i");
					if(text.match(re)!=null) {
						if(word_list[f].type!='ignore') thisout = word_list[f];
						else thisout = 'ignore';
						text = text.replace(re,'');
						break;
					}
				}
			}
			if(thisout==null) {
				//try day names
				for (var f=0; f<days.length; f++)
				{
					var re = new RegExp("^" + days[f] + "[a-z]*", "i");
					if(text.match(re)!=null) {
						thisout = {word:days[f],value:" " + days[f] + " ",type:'day_name'};
						text = text.replace(re,'');
						break;
					}
				}
			}
			if(thisout==null) {
				//is it a more complex thing?
				var m = text.match(/^(\S+)/i);
				if(m!=null) {
					thisout = {word:m[1],value:" " + m[1] + " ",type:'unknown'};
					text = text.replace(/^\S+/i,'');
				}
			}
			if(thisout!=null) {
				if(thisout!='ignore') outarr[outarr.length] = thisout;
			}
			else {
				alert('aaaarrrgh null');
				break;
			}
		}
		return outarr;
	}
	function better_split(text) {
		text = text.replace(/([0-9]+)([a-z]+)/gi,'$1 $2') // split words and numbers
		text = text.replace(/([a-z]+)([0-9]+)/gi,'$1 $2') // ditto
		var outarr = [];
		while(text.length>0) {
			
			var r = RegExp("^([0-9]+ st|[0-9]+ nd|[0-9]+ rd|[0-9]+ th)","i");
			var mat = text.match(r);
			if(mat!=null) {
				outarr[outarr.length] = mat[1].replace(/ /,'');
				text = text.replace(r,'');
			}
			else {
				var re = RegExp("^([0-9]+|[a-z]+|\s+|[^0-9^a-z^\s]+)","i");
				var m = text.match(re);
				if(m!=null) {
					outarr[outarr.length] = m[1];
					re = RegExp("^" + m[1].replace(/\\/gi,"\\\\"),"i");
					text = text.replace(re,'');
				} else {
					break;
				}
			}
		}
		return outarr;
	}
	function replace_numbers(text){
		//to replace the numbers, split into words, if a ten is followed by a single then combine them, if a hundred is fo
		
		var num_split = better_split(text); //find a better way to split****************************************************** DONE
		var last_number_type = null;
		var last_number_pos = null;
		for(var f=0; f<num_split.length; f++)
		{
			if(num_split[f]!=0) {
				num_split[f] = num_split[f].replace(/^[0]+/,'');
			}
			var char_match = num_split[f].match(/[^0-9^a-z]+/i);
			if(char_match!=null) continue;
			//is it a regular number? if so remember the type and ignore
			var this_num = null;
			var positional = false;
			
			this_num = parseInt(num_split[f]);
			if(isNaN(this_num)) this_num=null;
			else {
				if(num_split[f].match(/st|nd|rd|th/gi)!=null)
					positional = true;
			}
			if(this_num!=null) {
				if(this_num>0) {
					if(last_number_type=='tens') {
						this_num = parseInt(num_split[last_number_pos]) + this_num;
						num_split[last_number_pos] = "";
					}
					else if(last_number_type=='hundred') {
						this_num = parseInt(num_split[last_number_pos]) + this_num;
						num_split[last_number_pos] = "";
					}
					last_number_pos = f;
					last_number_type = 'single';
				}
				else if(this_num>9) {
					if(last_number_type=='hundred') {
						this_num = parseInt(num_split[last_number_pos]) + this_num;
						num_split[last_number_pos] = "";
					}
					last_number_pos = f;
					last_number_type = 'tens';
				}
				else if(this_num>100) {
					last_number_pos = f;
					last_number_type = 'hundred';
				}
			}
			if(this_num==null)
			{
				if(num_split[f]=='hundred') {
					if(f>0&&last_number_type=='single') {
						this_num = 100 * parseInt(num_split[last_number_pos]);
						num_split[last_number_pos] = "";
					}
					else{
						this_num = 100;
					}
					last_number_pos = f;
					last_number_type='hundred';
				}
				else {
					//try positional tens
					for(var t=0;t<pos_tens.length;t++){
						if(num_split[f]==pos_tens[t]) {
							if(last_number_type=='hundred') {
								this_num = parseInt(num_split[last_number_pos]) + ((t+2) * 10);
								num_split[last_number_pos] = "";
							}
							else{
								this_num = (t+2) * 10;
							}
							positional = true;
							last_number_pos = f;
							last_number_type = 'tens';
							break;
						}
					}
					if(this_num==null){
						//try tens
						for(var t=0;t<num_tens.length;t++){
							if(num_split[f]==num_tens[t]) {
								if(last_number_type=='hundred') {
									this_num = parseInt(num_split[last_number_pos]) + ((t+2) * 10);
									num_split[last_number_pos] = "";
								}
								else{
									this_num = (t+2) * 10;
								}
								last_number_pos = f;
								last_number_type = 'tens';
								break;
							}
						}
					}
					if(this_num==null) {
						//try positional_numbers
						for(var t=0;t<pos_nos.length;t++){
							if(num_split[f]==pos_nos[t]) {
								if(last_number_type=='tens') {
									this_num = parseInt(num_split[last_number_pos]) + (t+1);
									num_split[last_number_pos] = "";
								}
								else if(last_number_type=='hundred') {
									this_num = parseInt(num_split[last_number_pos]) + (t+1);
									num_split[last_number_pos] = "";
								}
								else{
									this_num = (t+1);
								}
								last_number_pos = f;
								last_number_type = 'single';
								positional = true;
								break;
							}
						}
					}
					if(this_num==null) {
						//try single numbers
						for(var t=0;t<num_singles.length;t++){
							if(num_split[f]==num_singles[t]) {
								if(last_number_type=='tens') {
									this_num = parseInt(num_split[last_number_pos]) + (t+1);
									num_split[last_number_pos] = "";
								}
								else if(last_number_type=='hundred') {
									this_num = parseInt(num_split[last_number_pos]) + (t+1);
									num_split[last_number_pos] = "";
								}
								else{
									this_num = (t+1);
								}
								last_number_pos = f;
								last_number_type = 'single';
								break;
							}
						}
					}
				}
			}
			if(this_num==null) {
				last_number_pos = null;
				last_number_type = null;
			}
			else {
				/*if(this_num>0) last_number_type = 'single';
				else if(this_num>9) last_number_type = 'tens';
				else if(this_num>100) last_number_type = 'hundred';*/
				num_split[f] = this_num;
				if(positional) num_split[f] += 'st';
			}
		}
		var output = num_split.join("");
		return output;

		//until the text is read, test the first bit of text against a word, decide what to do with it then delete that word from the text, if can't understand a word then find the next understandable word and send the garbage to the date interpreter
	}
	function interpret_date(text,type){
		
		//is it a range?
		text = text.toLowerCase();
		var is_positional = false;
		
		if(text.indexOf("st")!=-1) is_positional = true;
		text = text.replace(/(\b|[0-9])(st|nd|rd|th|of)\b/gi,'$1');
		/*if(text.match(/-/gi).length>1) {*/
			ranges = text.split(/\sto\s|\s\s-|>|>=/gi);
			range_type = text.match(/\sto\s|\s\s-|>|>=/gi);
		/*}
		else {
			ranges = text.split(/\sto\s|-|>|>=/gi);
			range_type = text.match(/\sto\s|-|>|>=/gi);
		}*/
		var date = {
			error: true
		};
		if(ranges.length==1) {
			//not a range
			date = {from:parse_date_bit(ranges[0],is_positional),is_range:false};
		}
		else if(ranges.length==2) {
			//good range
			date = {
				from:parse_date_bit(ranges[0],is_positional),
				to:parse_date_bit(ranges[1],is_positional),
				inclusive:((""+range_type).match(/=/gi)?true:false),
				is_range:true
			};
		}
		else {
			
			//bad range
		}
		return date;
		//bit = parse_date_bit(ranges[0],type);
	}
	function parse_date_bit(text,is_positional)
	{
		//could be 
		/*
			number
			day of week
			month
			year
			day/month
			time (10am, 10.15am, 15:13, 4:42pm)
			full date
		*/
		var time = null;
		var day = null;
		var month = null;
		var year = null;
		var type = null;
		var value = null;
		//var is_positional = false;
		
		text = text.replace(/^\s+|\s+$/gi,''); //trim
		text = text.replace(/\s+/gi,' '); //remove double spaces
		
		var sp = text.match(/([/\.:\\,-]|am|pm)/gi);
		if(sp==null) {
			//its a number or a day of the week or a month
			var output = text;
			
			//check for dayname_monthname
			var dm_check = text.match(/^([a-z]+)[^0-9^a-z]+([a-z]+)$/);
			if(dm_check!=null) {
				var tmp = parse_day_name(dm_check[1]);
				if(typeof(tmp)=='number') {
					var tmpmon = parse_month_name(dm_check[2]);
					if(typeof(tmpmon)=='number') {
						return {type:'day_name_month',value:tmp + "/" + tmpmon};
					}
				}
				else {
					tmp = parse_month_name(dm_check[1]);
					if(typeof(tmp)=='number') {
						var tmpday = parse_day_name(dm_check[2]);
						if(typeof(tmpday)=='number') {
							return {type:'day_name_month',value:tmpday + "/" + tmpmon};
						}
					}
				}
			}
			//check for dayname_monthname_year
			var dm_check = text.match(/^([a-z]+)[^0-9^a-z]+([a-z]+)[^0-9^a-z]+([0-9]+)$/);
			if(dm_check!=null) {
				var year = parseInt(dm_check[3]);
				if(year<50) year += 2000;
				else if(year<100) year += 1900;
				var tmp = parse_day_name(dm_check[1]);
				if(typeof(tmp)=='number') {
					var tmpmon = parse_month_name(dm_check[2]);
					if(typeof(tmp)=='number') {
						return {type:'day_name_month_year',value:tmp + "/" + tmpmon + "/" + year};
					}
				}
				else {
					tmp = parse_month_name(dm_check[1]);
					if(typeof(tmp)=='number') {
						var tmpday = parse_day_name(dm_check[2]);
						if(typeof(tmpday)=='number') {
							return {type:'day_name_month_year',value:tmpday + "/" + tmpmon + "/" + year};
						}
					}
				}
			}

			//try for day/year month/year
			var all_letters = text.match(/^([a-z]+)[^0-9^a-z]+[0-9]+$/);
			if(all_letters!=null) {
				var just_letters = all_letters[1];
				if(just_letters!='') {
					var tmp = parse_day_name(just_letters);
					if(tmp!='') {
						var y = text.match(/([0-9]+)/);
						if(y!=null) {
							var year = parseInt(y[1]);
							if(year<50) year += 2000;
							else if(year<100) year += 1900;
							return {type:'day_name_year',value:tmp + "/" + year};
						}
					}
				}
				if(just_letters!='') {
					var tmp = parse_month_name(just_letters);
					if(tmp!='') {
						var y = text.match(/([0-9]+)/);
						if(y!=null) {
							var year = parseInt(y[1]);
							if(year>31 && !is_positional) {
								if(year<50) year += 2000;
								else if(year<100) year += 1900;
								return {type:'month_year',value:tmp + "/" + year};
							}
						}
					}
				}
			}
			if(text.indexOf(" ")==-1) {
				output = parse_day_name(text);
				if(typeof(output)=='number') return {type:'day_name',value:output}; //could be dayname, year
				output = parse_month_name(text);
				if(typeof(output)=='number') return {type:'month',value:output};
			}
		}
		sp = text.match(/([\s/\.:\\,-]|am|pm)/gi);
		if(sp==null) {
			text = text.replace(/[^0-9]/gi,'');
			try{
				output = parseInt(text);
				if(is_positional) return {type:'period_specifier_number',value:output};
				else return {type:'number',value:output};
			}catch(e){

			}
			return {type:'unknown',value:0};
		}
		//something more complex
		//replace month with number
		for(var m=0;m<months.length;m++){
			var re = new RegExp("(\\b|[0-9])" + months[m] + "[a-z]*(\\b|[0-9])","gi");
			text = text.replace(re,function($0,$1,$2) {
				month = m+1;
				var output = "" + (m+1) + "";
				if($1.match(/[0-9]/gi)) 
					output =  "/" + output;
				if($2.match(/[0-9]/gi))
					output = output + "/";
				return $1 + output + $2;
			});
		}
		text = text.replace(/(\d+)\s*([:\.]*)\s*(\d*)\s*(am|pm|)/gi,function($0,$1,$2,$3,$4){
			if($0.replace(/^\s+|\s+$/gi,'')==$1) return $0;//just got a number it ain't nothing to worry about
			var hour = parseInt($1);
			var min = parseInt($3);
			if(!min) min = "00";
			if($4=="pm") hour += 12;
			if(hour>24||min>59 || ($4==""&&$2=="")) return $0;
			if(min<10&&min>0) min = "0" + min;
			time = hour + ":" + min;
			return '';
		});
		if(text=="")
		{
			return {type:'time',value:time};
		}
		//get rid of daynames and other distractions
		for(var m=0;m<days.length;m++){
			var re = new RegExp(days[m] + "[a-z]*","gi");
			text = text.replace(re,'');
		};
		
		//split what we have left
		//sp = text.split(/[\s/\.:\\,]/gi);
		text = text.replace(/(\d+)[^\d]*(\d*)[^\d]*(\d*)/gi,function($0,$1,$2,$3){
			if(parseInt($3)) {
				//should do sql date format too ****************************************************
				if(parseInt($1)>31) {
					//sql format
					year = parseInt($1);
					if(year<50) year += 2000;
					else if(year<100) year += 1900;
					if(parseInt($3)==month||parseInt($2)>12) {
						month = parseInt($3);
						day = parseInt($2);
					} else {
						if(month==null) month = parseInt($2);
						day = parseInt($3);
					}
				}
				else {
					year = parseInt($3);
					if(year<50) year += 2000;
					else if(year<100) year += 1900;
					if(parseInt($1)==month||parseInt($2)>12) {
						month = parseInt($1);
						day = parseInt($2);
					} else {
						if(month==null) month = parseInt($2);
						day = parseInt($1);
					}
				}
				value = year + "/" + month + "/" + day;
				if(time!=null) value += " " + time;
				type = 'full_date';
				return '';
			}
			if(parseInt($2)) {
				//this probably needs looking at***************************************************************************************
				if(parseInt($1)==month) {
					day = parseInt($2);
					month = parseInt($1);
				}else {
					day = parseInt($1);
					month = parseInt($2);
				}
				if(day>31) {
					var this_day = day;
					if(day<50) this_day += 2000;
					else if(day<100) this_day += 1900;
					
					if(month<13) {
						value = month + "/" + this_day;
						type = 'month_year';
					}
					else {
						/*could be a misreading*/
						if(month<50) month += 2000;
						else if(month<100) month += 1900;
						value = day + "/" + month;
						type = 'month_year';
					}
				}
				else if(month>31) {
					if(month<50) month += 2000;
					else if(month<100) month += 1900;
					//if(day<13) {
						value = day + "/" + month;
						type = 'month_year';
					/*}
					else {
						value = 0;
						type = 'unknown';
					}*/
				}
				else if(month>12&&day>12) {
					if(month<50) month += 2000;
					else if(month<100) month += 1900;
					if(day<13) {
						value = day + "/" + month;
						type = 'month_year';
					}
					else {
						value = 0;
						type = 'unknown';
					}
				}
				else if(month>12) {
					value = month + "/" + day;
					type = 'day_month';
				}
				
				else {
					value = day + "/" + month;
					type = 'day_month';
				}
				return '';
			}
		});
		return {type:type,value:value};
	}
	function parse_month_name(text){
		for(var m=0;m<months.length;m++){
			var re = new RegExp("^" + months[m] + "[a-z]*","i");
			if(text.match(re)!=null)
				return m+1;
		};
		return '';
	}
	function parse_day_name(text){
		for(var m=0;m<days.length;m++){
			var re = new RegExp("^" + days[m] + "[a-z]*","i");
			if(text.match(re)!=null)
				return m+1;
		};
		return '';
	}
    function interpret_duration(text){
        text = replace_numbers(text.toLowerCase());
        text = text.replace(/half/gi, '30');
        text = text.replace(/quarter/gi, '15');
        var numbers = [];
        var split = better_split(text);
        var duration = 0;
        var nextPeriod = 'm';
        for(var f=0; f<split.length; f++) {
            //is it a number?
            if(split[f].match(/^an$|^[0-9]+$/)) {
                numbers.push(split[f].replace(/an/,'1'));  
            }
            else if(split[f].indexOf('h')===0) {
                var num = numbers.splice(0,1);
                if(!num) {
                    num = 1;   
                }
                duration += num * 60 * 60 * 1000;
                nextPeriod = 'm';
            }
            else if(split[f].indexOf('m')===0) {
                var num = numbers.splice(0,1);
                if(!num) {
                    num = 1;   
                }
                duration += num * 60 * 1000;
                nextPeriod = 's';
            }
            else if(split[f].indexOf('s')===0) {
                var num = numbers.splice(0,1);
                if(!num) {
                    num = 1;   
                }
                duration += num * 1000;
            }
            else if(split[f].indexOf(/[\.:;\/\\]/)===0) {
                   
            }
        }
        if(numbers.length>0) {
            if(nextPeriod.indexOf('h')===0) {
                var num = numbers.splice(0,1);
                if(!num) {
                    num = 1;   
                }
                duration += num * 60 * 60 * 1000;
            }
            else if(nextPeriod.indexOf('m')===0) {
                var num = numbers.splice(0,1);
                if(!num) {
                    num = 1;   
                }
                duration += num * 60 * 1000;
            }
            else if(nextPeriod.indexOf('s')===0) {
                var num = numbers.splice(0,1);
                if(!num) {
                    num = 1;   
                }
                duration += num * 1000;
            }          
        }
        return duration;
    }
    function format_duration(duration) {
        var date = new Date(duration);
        var hh = date.getUTCHours();
        var mm = date.getUTCMinutes();
        var ss = date.getSeconds();
        var out = '';
        if(hh>0) {
            out += hh + (hh===1 ? ' hour ' : ' hours ');   
        }
        if(mm>0) {
            out += mm + (mm===1 ? ' minute ' : ' minutes ');   
        }
        if(ss>0) {
            out += ss + (ss===1 ? ' second ' : ' seconds ');   
        }
        return out;           
    }
	$(function(){
		reset_date_inputs();
	});
    
    return {
        interpretText:function(text){
            return interpret_text(text);   
        },
        interpretDuration:function(text){
            return interpret_duration(text);   
        },
        formatDuration:function(duration){
            return format_duration(duration);   
        }
    }
};
var iD = interpretDate();