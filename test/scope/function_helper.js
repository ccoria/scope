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
	
	//TODO: change this description
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