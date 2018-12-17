(function($){
  $(function(){
    let options = {
      autoClose: true
    }
    $('.sidenav').sidenav();
    $('select').formSelect();
    $('.datepicker').datepicker(options);

    let wrapper = $('#newPay');
    $('#addNew').click(function (e) {
      e.preventDefault();
      $(wrapper).append(
        `
        <div class="input-field col s12 m6">
            <input id="accountNumber" type="text" name="accountNumber" class="validate">
            <label for="accountNumber">Account Number</label>
            <span class="helper-text" data-error="wrong" data-success="right">Required</span>
          </div>
          <div class="input-field col s12 m6">
            <input id="price" type="number" step="0.01" name="price" class="validate">
            <label for="price">Price</label>
            <span class="helper-text" data-error="wrong" data-success="right">Required</span>
          </div>
        `
      );
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
