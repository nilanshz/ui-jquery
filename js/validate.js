$.fn.validateForm = function(options){

    var form = $(this);

    var failedRules = 0;

    var element = {
        errorShow : function(fieldInput, message){
            var fieldInputContainer = fieldInput.parents(".input");

            if(!fieldInputContainer.find(".message--error").length) {
                fieldInputContainer.append("<div class='message message--error'></div>");
            }

            fieldInputContainer.addClass("input--error");
            fieldInputContainer.find(".message--error")
                .addClass("message--active")
                .text(message);
        },
        errorHide : function(fieldInput) {
            var fieldInputContainer = fieldInput.parents(".input");

            fieldInputContainer.removeClass("input--error");
            fieldInputContainer.find(".message--error").removeClass("message--active");
        },
        rules : {
            required : function(value){
                return (value == "" || value == null);
            }
        }
    };

    $.each(options.fields, function(name, field){

        var fieldInput = form.find("[name='"+name+"']");

        $.each(field.rules, function(ruleName, rule){
            var ruleFailed = element.rules[ruleName](fieldInput.val());
            failedRules += ruleFailed;

            if(ruleFailed) {
                element.errorShow(fieldInput, rule.message);
            } else {
                element.errorHide(fieldInput);
            }

            return false;
        });

    });
    return !failedRules;
};