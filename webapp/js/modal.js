var modal = {
  alertModal: function (param) {
    $("#operModal").remove();
    let html = `<div class="modal fade modal-confirm ${param.className}" id="operModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-sm" role="document" style="top:50%;margin-top: -100px;">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">${param.title}</h4>
            </div>
            <div class="modal-body">
                ${param.info}
            </div>
            <div class="modal-footer" style="text-align: center">
                <button type="button" class="btn btn-rest" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">确认</button>
            </div>
        </div>
    </div>
    </div>`;
    $('#modalContainer').html(html);
    $("#operModal").modal("show");
  },
  operModal: function (param) {
    $("body").find('.modal-backdrop').remove();
    $("#modalAlert").remove();
    let html = `<div class="modal fade modal-confirm ${param.className}" id="modalAlert" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-sm" role="document" style="top:50%;margin-top: -100px;width: 20%">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">提示</h4>
            </div>
            <div class="modal-body">
                <h3>${param.info}</h3>
            </div>
        </div>
    </div>
    </div>`;
    $('#modalContainer').html(html);
    $("#modalAlert").modal("show");
  },
  loaders: function (display) {
    display = display || 'none';
    let html = `<div class="loader-inner line-scale-pulse-out">
                 <div></div>
                 <div></div>
                 <div></div>
                 <div></div>
                 <div></div>
             </div>`;
    $("#loaders").html(html).css('display', display);
  }
}