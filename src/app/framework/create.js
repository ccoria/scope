framework.create = function (name, _class_function) {
    gs[name] = function () {
	    var context = {}
        context.public = {};
        context.events = {};

        context.events.fire = function (event_name, data) {
            context.events[event_name](data);
        };

        context.public.on = function (event_name, handler) {
            context.events[event_name] = function (data) {
               handler(data);
            };
        };
    
        var __args = [context];
        for (var i = 0; i < arguments.length; i++) {
            __args.push(arguments[i]);
        }

        _class_function.apply(context, __args);
        
        return context.public;
    };
};
