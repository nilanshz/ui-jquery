var data = [
    {
        team: 'Engineering',
        employees: [
            'Lawana Fan',
            'Larry Rainer',
            'Rahul Malik',
            'Leah Shumway'
        ]
    },
    {
        team: 'Executive',
        employees: [
            'Rohan Gupta',
            'Ronda Dean',
            'Robby Maharaj'
        ]
    },
    {
        team: 'Finance',
        employees: [
            'Caleb Brown',
            'Carol Smithson',
            'Carl Sorensen'
        ]
    },
    {
        team: 'Sales',
        employees: [
            'Ankit Jain',
            'Anjali Maulingkar'
        ]
    }
];


$.fn.dropElement = function(options) {

    var settings = {
        dropdowns : {},
    }

    var element = {
        initialize : function(drop_down) {

            if(!drop_down.siblings(".dropdown").length) {
                var dropdownString = "\
                    <div class='dropdown'>\
                        <input type='text' class='dropdown__placeholder'>\
                        <div class='menu'>\
                        </div>\
                    </div>";


                drop_down.parent(".input").append(dropdownString);
            }
            var custom_drop = drop_down.siblings("div.dropdown");

            if(drop_down.attr("placeholder") != undefined) {
                custom_drop.find(".dropdown__placeholder").val(drop_down.attr("placeholder"));
            }

            if(drop_down.hasClass("searchable")) {

                if(!custom_drop.find(".dropdown__search").length) {
                    custom_drop.prepend("<input type='hidden' class='dropdown__search'>");
                }
            } else {
                custom_drop.find(".dropdown__placeholder").attr("readonly", "readonly");
            }

            element.developOptions(custom_drop);
            element.bindDropdown(custom_drop);
        },
        developOptions : function(custom_drop) {
            var dropdownOptions = "";
            var drop_down = custom_drop.siblings("select");

            drop_down.find("option:not(:disabled)").each(function(){
                dropdownOptions += "<div class='menu__item' data-value='"+$(this).val()+"'>"+$(this).text()+"</div>";
            });
            custom_drop.find(".menu").html(dropdownOptions);
            var selectedOption = drop_down.val();
            element.selectParticularItem(custom_drop, custom_drop.find(".menu__item[data-value='"+selectedOption+"']")) 
            element.bindOptions(custom_drop);
        },
        bindOptions : function(custom_drop) {
            custom_drop.find(".menu__item").off("click").on("click", function(){
                element.selectParticularItem(custom_drop, $(this));
            });
        },
        bindDropdown : function(custom_drop) {

            var drop_down = custom_drop.siblings("select");
            custom_drop.attr("class", drop_down.attr("class"));

            $(document).off("click.dropdown").on("click.dropdown", function(e){

                /* select all dropdowns if clicked outside all dropdowns or */
                var openDropdowns = settings.dropdowns.not($(e.target));

                /* select all dropdowns except the one which is clicked*/
                if(!$(e.target).is(".menu") && !$(e.target).parents(".menu").length && !$(e.target).parents(".menu").parents(".dropdown").length) {
                    openDropdowns = openDropdowns.not($(e.target).parents(".dropdown"));
                }   

                $(openDropdowns).each(function(){
                    element.dropClose($(this));
                });

            });

            $(document).off("keydown.dropdown").on("keydown.dropdown", function(e){

                e = (e) ? e : document.event;
                var key_pressed = (e.which) ? e.which : e.keyCode;
                if(key_pressed == 40 || key_pressed == 38) {
                    $(".dropdown__placeholder:focus").parents(".dropdown").addClass("dropdown--active");
                }
                var dropdown = $(".dropdown--active");

                if(dropdown.length) {
                    if(key_pressed == 40) {
                        element.selectNextItem(dropdown);
                    } else if(key_pressed == 38) {
                        element.selectPreviousItem(dropdown);
                    } else if(key_pressed == 13) {
                        var activeItem = dropdown.find(".menu_item_selected");
                        if(!activeItem.length) {
                            activeItem = dropdown.find(".menu_item_active");
                        }
                        element.selectParticularItem(dropdown, activeItem);
                        dropdown.find(".dropdown__placeholder").trigger("blur");
                        $(document).trigger("click");
                    }
                }

            });

            drop_down.off("DOMSubtreeModified").on("DOMSubtreeModified",function(){
                element.developOptions($(this).siblings(".dropdown"));
            });

            custom_drop.find(".dropdown__placeholder").off("focus").on("focus", function(){
                var currentDropdown = $(this).parents(".dropdown");
                setTimeout(function(){
                    element.dropOpen(currentDropdown);
                }, 200);
            });

            custom_drop.find(".dropdown__placeholder").off("blur").on("blur", function(){
                var currentDropdown = $(this).parents(".dropdown");
                setTimeout(function(){
                    element.dropClose(currentDropdown);
                }, 200);
            });

            custom_drop.find("input:text.dropdown__placeholder").off("keyup").on("keyup", function(){
                element.setSearchQuery(custom_drop, $(this).val());
            });

            settings.dropdowns = $("div.dropdown");
        },

        dropOpen : function(custom_drop) {

            custom_drop.addClass("dropdown--active");

            if(custom_drop.hasClass("searchable")) {
    
                var searchField = custom_drop.find(".dropdown__search")
                if(searchField.val() != "") {
                    custom_drop.find(".dropdown__placeholder").val(searchField.val());
                } else {
                    element.clearInput(custom_drop);
                }

            }
        },

        dropClose : function(custom_drop) {
            custom_drop.removeClass("dropdown--active");

            var title = custom_drop.find(".dropdown__placeholder");
            element.setInput(custom_drop);
        },

        clearInput : function(custom_drop) {
            var title = custom_drop.find(".dropdown__placeholder");
            title.val("");
        },

        selectPreviousItem : function(custom_drop) {

            var selectedItem = custom_drop.find(".menu_item_active");

            if(!selectedItem.length) {
                selectedItem = custom_drop.find(".menu_item_selected");
            }

            if(selectedItem.length) {
                if(selectedItem.index() != 0) {
                    element.highlightItem(custom_drop, selectedItem.prev());
                }
            } else {
                element.highlightItem(custom_drop, custom_drop.find(".menu__item:last-child"));
            }
        },

        selectNextItem : function(custom_drop) {

            var selectedItem = custom_drop.find(".menu_item_active");

            if(!selectedItem.length) {
                selectedItem = custom_drop.find(".menu_item_selected");
            }

            if(selectedItem.length) {
    
                if(selectedItem.index() != (custom_drop.find(".menu__item").length - 1)) {
                    element.highlightItem(custom_drop, selectedItem.next());
                }
            } else {
                element.highlightItem(custom_drop, custom_drop.find(".menu__item:first-child"));
            }
        },

        selectParticularItem : function(custom_drop, item) {
            var drop_down = custom_drop.siblings("select");

            drop_down.val(item.data("value"));
            custom_drop.find(".menu__item").removeClass("menu_item_active").removeClass("menu_item_selected");
            item.addClass("menu_item_selected");
            element.setInput(custom_drop);

            if(custom_drop.hasClass("searchable") && !custom_drop.find(".dropdown__placeholder").is(":focus")) {
                element.setSearchQuery(custom_drop, "");
            }
            drop_down.trigger("change");
        },

        highlightItem : function(custom_drop, item) {
            var drop_down = custom_drop.siblings("select");

            drop_down.val(item.data("value"));
            custom_drop.find(".menu__item").removeClass("menu_item_active").removeClass("menu_item_selected");
            item.addClass("menu_item_active");
            element.setInput(custom_drop);
        },

        setInput : function(custom_drop) {
            var selectedText = custom_drop.siblings("select").find("option:selected").text();
            var title = custom_drop.find(".dropdown__placeholder");

            if(!title.is(":focus")) {
                if(selectedText != "") {
                    title.val(selectedText);
                } else {
                    title.val(custom_drop.siblings("select").attr("placeholder"));
                }
            }
        },

        setSearchQuery : function (custom_drop, query) {
            var drop_down = custom_drop.siblings("select");

            if(drop_down.find("option:selected").text() == query) {
                query = "";
            }

            custom_drop.find(".dropdown__search").val(query);
            element.search(custom_drop);
        },

        search : function(custom_drop) {
            var drop_down = custom_drop.siblings("select");

            drop_down.find("option").prop("disabled", false);

            var query = custom_drop.find(".dropdown__search").val();
            if(query != "") {
                query = query.toLowerCase();

                drop_down.find("option").each(function(){
                    var optionText = $(this).text().toLowerCase();

                    if(optionText.indexOf(query) != 0) {
                        $(this).prop("disabled", true);
                    }
                });
            }
        }
    }

    $(this).each(function(){
        element.initialize($(this));
    })
}

var element_setter = {
    employee : {
        checkedEmailCheckBox : false,
        name : '',
        team : '',
    },
    makeEmployee : function(form){
        element_setter.employee.checkedEmailCheckBox = form.find("[name='sendEmail']").prop("checked");
        element_setter.employee.name = form.find("[name='employee'] option:selected").text();
        element_setter.employee.team = form.find("[name='team'] option:selected").text();
    },
    welcomeEmployee : function(form) {
        var emailText = element_setter.employee.checkedEmailCheckBox ? "Email option checked" : "Email option not checked";
        $(".welcome").addClass("hidden");
        $(".welcome_message").removeClass("hidden");
        $(".welcome_message").find(".employee").text(element_setter.employee.name);
        $(".welcome_message").find(".team").text(element_setter.employee.team);
        $(".welcome_message").find(".sendEmail").text(emailText);
        $(".dialog").removeClass("dialog_open");
    },
    teamsDropdownAppend : function() {
        var options = "<option value=''>Select Team..</option>";

        $.each(data, function(key, teamData){
            options += "<option value='"+key+"'>"+teamData.team+"</option>";
        });

        $("#team").html(options);
    },

    employeesDropdownAppend : function(team) {
        var options = "<option value=''>Select Employee..</option>";

        if(data.hasOwnProperty(team)) {

            $.each(data[team].employees, function(key, employeeName){
                options += "<option value='"+key+"'>"+employeeName+"</option>";
            });

            $("#employee").html(options);
        } else {
            $("#employee").html("");
        }
    },
    setFormDefaults : function(form){
        var inputfields = ["input:text", "input:checkbox", "input:radio", "select"];

        $.each(inputfields, function(key, inputField) {

            var inputs = form.find($(inputField));

            $(inputs).each(function(){
                if($(this).is(":checkbox") || $(this).is(":radio")) {
                    $(this).data("defaultValue", $(this).prop("checked"));
                } else {
                    $(this).data("defaultValue", $(this).val());
                }
            })
        });
    },
    resetForm : function(form) {
        var inputfields = ["input:text", "input:checkbox", "input:radio", "select"];

        $.each(inputfields, function(key, inputField) {

            var inputs = form.find($(inputField));

            $(inputs).each(function(){
                if($(this).is(":checkbox") || $(this).is(":radio")) {
                    $(this).prop("checked", false);
                    $(this).data("defaultValue", $(this).prop("checked"));
                } else {
                    $(this).val("");
                    $(this).data("defaultValue", $(this).val());
                }
            })
        });
    }
};

$(document).ready(function(){

    $(".close-button").off("click").on("click", function(){
        $(this).parents(".dialog").removeClass("dialog_open");
    });

    $(".cancel-button").off("click").on("click" , function() {
        element_setter.resetForm($("#employee_form"));
        $(this).parents(".dialog").removeClass("dialog_open");
    })

    $(".dialogLink").off("click").on("click", function(){
        $(".dialog").addClass("dialog_open");
    });

    $("select.dropdown").dropElement();

    element_setter.teamsDropdownAppend();

    $("#team").off("change").on("change", function(){
        element_setter.employeesDropdownAppend($(this).val());
    });

    element_setter.setFormDefaults($("#employee_form"));

    $("#employee_form").off("submit").on("submit", function(e){

        var formIsValid = $(this).validateForm({
            fields : {
                team : {
                    rules : {
                        required : {
                            message : "Please select a team"
                        }
                    }
                },
                employee : {
                    rules : {
                        required : {
                            message : "Please select an employee"
                        }
                    }
                }
            }
        });

        if(formIsValid) {
            element_setter.makeEmployee($(this));
            element_setter.welcomeEmployee($(this));
        }
        e.preventDefault();
    })
});