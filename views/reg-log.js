
$('#menuProfile').removeClass("clickedProfile");
$('#menuAusfluege').removeClass("clickedAusfluege");

/* FORMS */
$('#btnRegister').on('click', () => {
    let name = $('#nameRegister');
    let username = $('#usernameRegister');
    let email = $('#emailRegister');
    let passwort = $('#pswRegister');
    $.ajax({
        url: '/user/register',
        method: 'post',
        data: {
            name: name.val(),
            username: username.val(),
            email: email.val(),
            passwort: passwort.val()
        },
        success: resp => {
            Swal.fire({
                icon: 'success',
                title: 'Dein Benutzerkonto wurde erfolgreich angelegt',
                text: '...gleich geht es weiter...',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(function () {
                window.location.href = '/ausfluege/ausfluege.html';
            });
        },


        error: resp => {
            name.css("background-color", "");
            username.css("background-color", "");
            email.css("background-color", "");
            passwort.css("background-color", "");
            let errors = resp.responseJSON.errors;
            let errorMsg = errors.map(function (err) {
                switch (err.param) {
                    case 'name':
                        name.css("background-color", '#F27474');
                        break;
                    case 'username':
                        username.css("background-color", '#F27474');
                        break;
                    case 'email':
                        email.css("background-color", '#F27474');
                        break;
                    case 'passwort':
                        passwort.css("background-color", '#F27474');
                        break;

                }
                return err.msg
            }).join('<br /><li/>')

            Swal.fire({
                title: 'Oops, etwas ist schiefgelaufen!',
                html: '<div class="errorMsg"><li>' + errorMsg + '</div>',
                icon: 'error',
                confirmButtonText: 'OK'
            })


        }
    })
})



$('#btnLogin').on('click', () => {
    let username = $('#usernameLogin')
    let passwort = $('#pswLogin');
    $.ajax({
        url: '/user/login',
        method: 'post',
        data: {
            username: username.val(),
            passwort: passwort.val()
        },
        success: resp => {
            Swal.fire({
                icon: 'success',
                title: `Hallo ${resp.name}`,
                text: '...Willkomen zurück...',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(function () {
                window.location.href = '/ausfluege/ausfluege.html'
            });

        },
        error: resp => {
            username.css("background-color", "");
            passwort.css("background-color", "");
            let errors = resp.responseJSON.errors;
            let errorMsg = errors.map(function (err) {
                if (err.param == 'username' || err.param == 'passwort') {
                    username.css("background-color", '#F27474');
                    passwort.css("background-color", '#F27474');
                    return err.msg
                }
            }).join('<br /><li/>')

            Swal.fire({
                title: 'Oops, etwas ist schiefgelaufen!',
                html: '<div class="errorMsg"><li>' + errorMsg + '</div>',
                icon: 'error',
                confirmButtonText: 'OK'
            })

        }
    })
})


