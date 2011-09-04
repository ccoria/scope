
scope.create = function (name, _class_function) {
    var helper = scope.function_helper;

    this[name] = function () {
        var interface = {};
        interface.public = {};
        interface.private = {};
        
        // TODO: extract this
        interface.events = {
        
            // returns a function that fires an event
            get_event_trigger: function () {
                return function (event_name, data) {
                    interface.events[event_name](data);
                }
            },
            
           // returns a function that listen an event
            get_event_listener: function () {
                return function (event_name, handler) {
                    interface.events[event_name] = function (data) {
                       handler(data);
                    };
                };
            }
        };

        // setting the event trigger
        interface.private.fire = interface.events.get_event_trigger();

        // calling the user defined function
        _class_function.apply(interface, arguments);

        // ----------------
        // changing contexts

        var all_properties = helper.merge_all_objects(interface);

        var commom_map = function (val) {
            var is_function = (typeof val === 'function');
            return ( is_function ? helper.contextualize(val, all_properties) : val)
        };

        interface.private = helper.functional(interface.public, {
            map: function (val) { return commom_map(val); }
        });

        interface.public = helper.functional(interface.public, {
            filter: function (val, object, key) { return (key !== 'on') },
            map: function (val) { return commom_map(val); }
        });
        
        // -----------------
 
        // setting the event listener
        interface.public.on = interface.events.get_event_listener();

        // Calling constructor, if it is defined
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
        functional,
        contextualize,
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
    
    contextualize = function (raw_function, new_context) {
        var new_function = function () {
            return raw_function.apply(new_context, arguments);
        };
        
        return new_function;
    };
    
    // TODO: remove side effect
    apply_context_in_batch = function (obj_functions_owner, new_context, bypass_function) {
        for (var property_name in obj_functions_owner) {
            if (property_name === bypass_function) continue;
            
            if (has_own_function(obj_functions_owner, property_name)) {
                
                var original = obj_functions_owner[property_name];
                obj_functions_owner[property_name] = contextualize(original, new_context);

            } else if (has_own_object(obj_functions_owner, property_name)) {
                apply_context_in_batch(obj_functions_owner[property_name], property_name);
            }
        }
    };
    
    functional = function (object, args) {
        
        // fallback function for filter
        var no_filter_func = function () { 
            return true; 
        };
        
        //fallback function for map
        var no_map_func = function (value) {
            return value;   
        };
        
        var get_function = function (arg_name, fallback_function) {
            if (typeof args[arg_name] === "function")
                return args[arg_name];
            else
                return fallback_function;
        }
        
        var filter = get_function('filter', no_filter_func);
        var map = get_function('map', no_map_func);
        
        var result = {};
        
        for (var prop in object) {
            if (filter(object[prop], object, prop)) {
                result[prop] = map(object[prop], object, prop);
            }
        }
        
        return result;
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
        var only_objects = functional(object, {
            filter: function (value, obj, key) {
                return has_own_object(obj, key);
            }
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
        functional: functional,
        contextualize: contextualize,
        object_merge: object_merge
    }

})();