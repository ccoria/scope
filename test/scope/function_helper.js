require("../../src/scope.js");
require("../../src/scope/create.js");

describe('function_helper tests', function () {
	
	it('should extract an (real)array from arguments and push a value to it', function () {
	    
	    var args = (function(arg1, arg2, arg3){
		    return arguments;
	    })(6,5,4); 
	
		var pushed_args = scope.function_helper.arguments_push(args, 7);
		
		expect(pushed_args[0]).toBe(7);
	});
	
	it('should verify if the object is a function property owner', function () {
		
		var myobj = {
			my_function: function () {},
			my_object: {}
		}
		
		var helper = scope.function_helper;
		expect(helper.has_own_function(myobj, 'my_function')).toBe(true);
		expect(helper.has_own_function(myobj, 'my_object')).toBe(false);
	});
	
	it('should verify if the object is a object property owner', function () {
		
		var myobj = {
			my_function: function () {},
			my_object: {}
		}
		
		var helper = scope.function_helper;
		expect(helper.has_own_object(myobj, 'my_function')).toBe(false);
		expect(helper.has_own_object(myobj, 'my_object')).toBe(true);
	});
	
	it('should merge objects', function () {
		
		var myobj = {
			level1_1: {
				level2_1: "value level2_1"
			},
			level1_2: {
				level2_2: "value level2_2"
			},
			level1_3: {
				level2_3: "value level2_3"
			}
		}
		
		var helper = scope.function_helper;
		var hash = helper.object_merge(myobj.level1_1, myobj.level1_2);
		hash = helper.object_merge(hash, myobj.level1_3);
		expect(hash.level2_1).toBe("value level2_1");
		expect(hash.level2_2).toBe("value level2_2");
		expect(hash.level2_3).toBe("value level2_3");
	});
	
	it('should filter (functions)', function () {
		
		var myobj = {
			prop1: "value1",
			prop2: function(){},
			prop3: 123,
			prop4: function(){}
		}
		
		var helper = scope.function_helper;
		
		//doing the filter
		var new_obj = helper.functional(myobj, {
			filter: function (val) { return (typeof val === "function") }
		});

		for (var property in new_obj) {
			if (new_obj.hasOwnProperty(property)) {
				expect(typeof new_obj[property]).toBe("function");
			}
		}
	});
	
	it('should filter (by numbers ops)', function () {
		
		var myobj = {
			prop1: 100,
			prop2: 200,
			prop3: 300,
			prop4: 400
		}
		
		var helper = scope.function_helper;
		var numbers = helper.functional(myobj, {
			filter: function (val) { return (val > 100 && val < 400) }
		});

		expect(numbers.prop1).toBeUndefined();
		expect(numbers.prop2).toBe(200);
		expect(numbers.prop3).toBe(300);
		expect(numbers.prop4).toBeUndefined();
	});
	
	it('should filter using object and key', function () {
		
		var myobj = {
			prop1: 100,
			prop2: 200,
			value: 300,
			prop4: 400
		}
		
		var helper = scope.function_helper;
		var numbers = helper.functional(myobj, {
			filter: function (val, object, key) { return (key.indexOf("prop") >= 0 && object[key] >= 200) }
		});

		expect(numbers.prop1).toBeUndefined();
		expect(numbers.prop2).toBe(200);
		expect(numbers.prop3).toBeUndefined();
		expect(numbers.prop4).toBe(400);
	});
	
	it('should map', function () {
		
		var myobj = {
			prop1: 1,
			prop2: 2,
			prop3: 3,
			prop4: 4
		}
		
		var helper = scope.function_helper;
		var strings = helper.functional(myobj, {
			map: function (val) { return (val + "") }
		});

		expect(strings.prop1).toBe("1");
		expect(strings.prop2).toBe("2");
		expect(strings.prop3).toBe("3");
		expect(strings.prop4).toBe("4");
	});
	
	it('should filter and map', function () {
		
		var myobj = {
			prop1: 1,
			prop2: 2,
			prop3: 3,
			prop4: 4
		}
		
		var helper = scope.function_helper;
		var strings = helper.functional(myobj, {
			filter: function (val) { return (val > 1 && val < 4); },
			map: function (val) { return (val + "") }
		});

		expect(strings.prop1).toBeUndefined();
		expect(strings.prop2).toBe("2");
		expect(strings.prop3).toBe("3");
		expect(strings.prop4).toBeUndefined();
	});
	
	it('should change the context of a function', function () {
		
		var my_expected_context = { id:1234 };
		
		var my_function = function (n1, n2, n3) {
			expect(this).toBe(my_expected_context);
			return n1 + n2 + n3;
		}
		
		var helper = scope.function_helper;
		var my_new_function = helper.contextualize(my_function, my_expected_context);
		
		var result = my_new_function(1,2,3);
		
		expect(result).toBe(6);
	});
	
	it('should merge all objects', function () {
		
		var myobj = {
			level1_1: {
				level2_1: "value level2_1"
			},
			level1_2: {
				level2_2: "value level2_2"
			},
			level1_3: {
				level2_3: "value level2_3"
			}
		}
		
		var helper = scope.function_helper;
		var hash = helper.merge_all_objects(myobj);

		expect(hash.level2_1).toBe("value level2_1");
		expect(hash.level2_2).toBe("value level2_2");
		expect(hash.level2_3).toBe("value level2_3");
	});
});