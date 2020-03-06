$.ajaxSetup({
    beforeSend: function (xhr) {
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType("application/json");
        }
    }
});

$.getJSON("config.json")
    .done(function (config) {

        const BOT_URL = config.telegram_api_url + config.bot_token;

        function sendMessage(message) {

            var httpRequest;

            httpRequest = new XMLHttpRequest();

            if (!httpRequest) {
                alert("Giving up :( Cannot create an XMLHTTP instance");
                return false;
            }
            httpRequest.onreadystatechange = alertContents;
            httpRequest.open("GET", BOT_URL + "/sendMessage?chat_id=" + config.chat_id + "&text=" + message);
            httpRequest.send();

            function alertContents() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        $("#requestResponse").text(httpRequest.responseText);
                    } else {
                        alert("There was a problem with the request.");
                    }
                }
            }

        }

        function transferToBot(event) {

            event.preventDefault();

            let msg = document.getElementById("textMessage").value;

            sendMessage(msg);

        }

        let form = document.getElementById("myForm");
        function handleForm(event) { event.preventDefault(); }
        form.addEventListener("submit", transferToBot);


        function prettify(message) {



        }

        $.get(BOT_URL + "/getUpdates", function (data) {

        })
            .done(function (data) {

                let results = data.result;

                for (let result of results) {

                    let message = result.message;

                    message.from.first_name;
                    message.from.last_name;
                    message.date;
                    message.text;

                    console.log(message);

                }

                $("#requestResponse").text(results);
            })
            .fail(function () {
                alert("error");
            });


    });