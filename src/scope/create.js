
scope.create = function (name, _class_function) {
	var helper = scope.function_helper;

    this[name] = function () {
	    var interface = {};
        interface.public = {};
        interface.private = {};
        interface.events = {};

        interface.private.fire = function (event_name, data) {
            interface.events[event_name](data);
        };

        interface.public.on = function (event_name, handler) {
            interface.events[event_name] = function (data) {
               handler(data);
            };
        };
    
        _class_function.apply(interface, arguments);

        var all_properties = helper.merge_all_objects(interface);

        //TODO: refactor this!
        helper.apply_context_in_batch(interface.public, all_properties, "on");
        helper.apply_context_in_batch(interface.private, all_properties);

        if (typeof interface.init === "function") { 
            interface.init.apply(all_properties);
        }
        
        return interface.public;
    };
};

scope.function_helper = (function() {
	var arguments_push, 
	    apply_context, 
	    has_own_function,
	    has_own_object, 
	    merge_all_objects,
	    object_merge;
	
	arguments_push = function (arguments_ref, new_value) {
		var __args = [new_value];
        for (var i = 0; i < arguments.length; i++) {
            __args.push(arguments[i]);
        }
    
        return __args;
	};
	
	has_own_function = function (object, function_name) {
		return (object
			    && typeof object[function_name] === "function" 
		        && object.hasOwnProperty(function_name));
	};
	
	has_own_object = function (object, key) {
		return (object
			    && typeof object[key] === "object" 
		        && object.hasOwnProperty(key));
	};
	
	filter = function (object, func) {
		var result = {};
		for (var name in object) {
			if (func(object[name], object, name))
			   result[name] = object[name];
		}
		return result;
	};
	
	// TODO: remove side effect
	apply_context_in_batch = function (obj_functions_owner, new_context, bypass_function) {
		for (var property_name in obj_functions_owner) {
			if (property_name === bypass_function) continue;
			
			if (has_own_function(obj_functions_owner, property_name)) {
				
				var original_func = obj_functions_owner[property_name];
				obj_functions_owner[property_name] = function () {
					var _args = arguments_push(arguments, new_context);

					return original_func.apply(new_context, arguments);
				};
			} else if (has_own_object(obj_functions_owner, property_name)) {
				apply_context_in_batch(obj_functions_owner[property_name], property_name);
			}
		}
	};
	
	object_merge = function (object1, object2) {
		for (var property_name in object1) {
			if (object1.hasOwnProperty(property_name)) {
				object2[property_name] = object1[property_name];
			}
		}
		
		return object2;
	};
	
	merge_all_objects = function (object) {
		var only_objects = filter(object, function (value, obj, key) {
			return has_own_object(obj, key);
		});
		
		var result = {}
		for (var obj_name in only_objects) {
			result = object_merge(result, only_objects[obj_name])
		}
	    
	    return result;
	};

    return {
        arguments_push: arguments_push,
        has_own_function: has_own_function,
        has_own_object: has_own_object,
        apply_context_in_batch: apply_context_in_batch,
        merge_all_objects: merge_all_objects,
        object_merge: object_merge
    }

})();