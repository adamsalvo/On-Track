/**
 * Created by tannergriffin on 3/29/2017.
 */

let collapse_panel_template = `
<div class="panel panel-default">
    <a data-toggle="collapse" href="#">
        <div class="panel-heading">
            <h4 class="panel-title">
                &nbsp;
            </h4>
        </div>
    </a>
    <div id="" class="panel-collapse collapse">
        <div class="panel-body">
            
        </div>
    </div>
</div>
`;
let create_collapse_panel = function (panel_id, panel_title, panel_body) {
    let panel = $(collapse_panel_template);
    $(panel.find("a")[0]).attr("href", "#" + panel_id);
    panel.find(".panel-title").text(panel_title);
    panel.find(".panel-collapse")[0].id = panel_id;
    panel.find(".panel-body").append(panel_body);
    return panel;
};

let entry_form_template = `
<div class="row">
    <div class="col-xs-12 col-sm-8">
        <h5 class="entry-name"></h5>
    </div>
    <div class="hidden col-xs-8 col-xs-offset-4 col-sm-4 col-sm-offset-0">
        <input type="hidden" class="entry-title">    
    </div>
    <div class="col-xs-8 col-xs-offset-4 col-sm-4 col-sm-offset-0">
        <input type="text" class="entry-value" >
    </div>
</div>
`;
let create_entry_form = function (entry) {
    let entry_id = entry['id'];
    let entry_title = entry['displayName'];
    let entry_name = entry['entryName'];
    let entry_value = entry['entryValue'];
    let category_id = entry['categoryId'];
    let row = $(entry_form_template);
    row.find('.entry-name').text(entry_title);
    let row_title = row.find('.entry-title');
    row_title.addClass(entry_name)
        .addClass("id_" + entry_id)
        .addClass("category_" + category_id);
    row_title.val(entry_title);
    let row_value = row.find('.entry-value');
    row_value.val(entry_value);
    row_value.addClass(entry_name);
    row_value.blur(update_display_name);
    return row;
};


let FORM_CATEGORIES = [
    1, 2, 3, 4, 6, 16, 17
];
let EIC_CATEGORIES = [
    7, 8, 9, 10, 11, 12, 13, 14
];
let APPLICABLE_FIGURES = 15;

let entries_by_category = {};

$(document).ready(function () {
    if (localStorage.getItem('token')) {
        console.log(1);

        $.ajax({
            'url': '../api/v1/api.php?endpoint=category',
            'method': 'GET',
            'dataType': 'json',
            'success': function (categories) {
                console.log(2);
                $.ajax({
                    'url': '../api/v1/api.php?endpoint=entry',
                    'method': 'GET',
                    'dataType': 'json',
                    'success': function (entries) {
                        for (let category_id = 0; category_id < categories.length; category_id++) {
                            let category = categories[category_id];
                            category['entries'] = [];
                            console.log('Category without entries', category);
                            entries_by_category[category['CategoryId']] = category;
                        }
                        console.log("Categories without entries", entries_by_category);
                        for (let entry_id = 0; entry_id < entries.length; entry_id++) {
                            let entry = entries[entry_id];
                            let category_id = entry['categoryId'];
                            if (entries_by_category[category_id]) {
                                entries_by_category[category_id]['entries'].push(entry);
                            }
                            else {
                                console.log("Error inserting into category ", category_id)
                            }
                        }
                        console.log("Entries by Category", entries_by_category);

                        for (let category_index in entries_by_category) {
                            let category = entries_by_category[category_index];
                            if (category['CategoryId'] in FORM_CATEGORIES) {
                                console.log('Form Category', category['CategoryId']);
                                let panel_id = 'category_body_' + category['CategoryId'];
                                let panel_title = category['CategoryName'];
                                let panel_body = $('<div class="entries"></div>');
                                for (let entry_id in category['entries']) {
                                    let entry = category['entries'][entry_id];
                                    create_entry_form(entry).appendTo(panel_body);
                                }
                                console.log('Panel Body', panel_body);

                                let panel = create_collapse_panel(panel_id, panel_title, panel_body);
                                panel.appendTo("#categories");

                            }
                            else if (category['CategoryId'] in EIC_CATEGORIES) {
                                console.log('EIC Category')
                            }
                        }
                    },
                    error: function(response){
                        console.log(response);
                    }
                });
            }
        });
        $('body').removeClass("hidden");
    }
    else{
        window.location.assign("login.html");
    }
});

let beforeSend = function(request){
    request.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
    );
};

let update_display_name = function () {
    let self = $(this);
    let entry_title = $(".entry-title");
    let new_display_name = entry_title.val();
    let entry_name = self.attr('class').split(' ')[1];
    let id = entry_title.attr('class').split(' ')[2].slice(3);
    let category = entry_title.attr('class').split(' ')[3].slice(9);
    let value = $(".entry-value." + entry_name);
    let new_value = value.val();

    console.log(entry_name, new_display_name, id, category, new_value);

    let data = {
        "entryId": id,
        "entryName": entry_name,
        "entryValue": new_value,
        "categoryId": category,
        "displayName": new_display_name
    };
    console.log(data);

    $.ajax({
        'url': '../api/v1/api.php?endpoint=entry',
        'method': 'PUT',
        'dataType': 'json',
        beforeSend: beforeSend,
        'data': JSON.stringify(data),
        'success': function (response) {
            console.log(response)
        }
    });
};

let create_user = function(){
    let USER_URL = '../api/v1/api.php?endpoint=user';
    let username = $("#username").val();
    let password = $("#password").val();
    $.ajax({
        url: USER_URL,
        method: 'POST',
        data: JSON.stringify({
            'username': username,
            'password': password
        }),
        beforeSend: beforeSend,
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if(response){
                window.location.assign("admin.html");
                $("#user-setup-panel").html(
                    "User created."
                )
            } else {
                alert('User not created, sorry.');
            }
        }
    })

};

let change_password = function(){
    let USER_URL = '../api/v1/api.php?endpoint=user';
    let oldPassword = $("#old-password").val();
    let password = $("#new-password").val();
    let password_confirm = $("#new-password-confirm").val();
    if(password == password_confirm)
    $.ajax({
        url: USER_URL,
        method: 'PUT',
        data: JSON.stringify({
            'oldPassword': oldPassword,
            'password': password
        }),
        beforeSend: beforeSend,
        dataType: 'json',
        success: function (response) {
            console.log(response);
            if(response){
                window.location.assign("admin.html");
                $("#user-setup-panel").html(
                    "User created."
                )
            } else {
                alert('User not created, sorry.');
            }
        }
    })
};

logout = function(){
    localStorage.removeItem("token");
    window.location.reload();
};

let reset_applicable_figures = function(){
    $.ajax({
        url: 'http://www.cottagesofhope.org/weberstate/ontrack/scrape/applicable-figures.php?url=' + $("#new-url").val(),
        dataType: "json",
        success: function(response){
            let progress = $("#a-f-progress");
            progress.removeClass("hidden");
            console.log(response);
            let count = response.length;
            let completed = 0;
            for(let i = 0; i < count; i++){
                $.ajax({
                    url: '../api/v1/api.php?endpoint=entry',
                    beforeSend: beforeSend,
                    data: JSON.stringify(response[i]),
                    success: function(response){
                        completed++;
                        progress.text(completed.toString() + ' of ' + count.toString());
                    }
                })
            }
        }
    })
};

let reset_eic = function(){
    let progress = $("#eic-progress");
    $.ajax({
        url: 'http://www.cottagesofhope.org/weberstate/ontrack/scrape/eic.php?url=' + $("#new-eic-url").val(),
        success: function(response){
            progress.text("Completed.")
        },
        error: function(response){
            progress.text("There was an error. If this was unexpected and you need this done, please email Tanner Griffin at tanner.w.griffin@gmail.com for help.");
        }
    });
    $("#eic-submit").attr("disabled", "disabled");
    progress.text("It should be working now. Please wait about 5 minutes. This is a really long and dumb process but it should work given time.")
};
