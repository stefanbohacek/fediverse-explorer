const toggleFormFields = (form, status) => {
    const inputs = form.getElementsByTagName("input");

    for (let i = 0; i < inputs.length; i++) { 
        inputs[i].disabled = !status;
    }

    const selects = form.getElementsByTagName("select");

    for (let i = 0; i < selects.length; i++) {
        selects[i].disabled = !status;
    }

    const textareas = form.getElementsByTagName("textarea");

    for (let i = 0; i < textareas.length; i++) { 
        textareas[i].disabled = !status;
    }

    const buttons = form.getElementsByTagName("button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = !status;
    }
}

window.toggleFormFields = toggleFormFields;

export default toggleFormFields;