function MarkerInfo(options) {

    options = options || {};

    this.frame_ = null;
    this.content_ = options.content || '';
    this.position_ = options.position || new google.maps.LatLng(0, 0);
    this.padding_ = options.padding || new google.maps.Size(10, 20);
    this.float_ = options.float || 'top';
    this.iconSize_ = new google.maps.Size(0, 0);

}
MarkerInfo.prototype = new google.maps.OverlayView();

MarkerInfo.prototype.open = function (map, anchor) {

    if (anchor) {
        this.position_ = anchor.getPosition();
        this.iconSize_ = anchor.icon.size;
    }

    this.setMap(map);
}

MarkerInfo.prototype.close = function () {

    this.setMap(null);
}

MarkerInfo.prototype.setContent = function (content) {

    this.content_ = content;
}

MarkerInfo.prototype.create = function () {

    if (!this.frame_) {

        var div = document.createElement('div');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';
        div.style.width = 'auto';
        div.style.height = 'auto';
        div.style.padding = 0;
        div.style.margin = 0;

        if (typeof this.content_.nodeType === "undefined") {
            div.innerHTML = this.content_;
        } else {
            div.appendChild(this.content_);
        }

        this.frame_ = div;

        var panes = this.getPanes();
        panes.floatPane.appendChild(div);
    }
}

MarkerInfo.prototype.draw = function () {

    this.create();

    var position = this.getProjection().fromLatLngToDivPixel(this.position_);

    var div = this.frame_;
    position.x -= div.clientWidth / 2;
    position.y -= div.clientHeight / 2 + this.iconSize_.height / 2;

    switch (this.float_) {
        case 'left':
            position.x -= div.clientWidth / 2 + this.iconSize_.width / 2 + this.padding_.width / 2;
            break;
        case 'right':
            position.x += div.clientWidth / 2 + this.iconSize_.width / 2 + this.padding_.width / 2;
            break;
        case 'bottom':
            position.y += div.clientHeight / 2 + this.iconSize_.height / 2 + this.padding_.height / 2;
            break;
        default:
            position.y -= div.clientHeight / 2 + this.iconSize_.height / 2 + this.padding_.height / 2;
    }

    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
};

MarkerInfo.prototype.hide = function () {

    if (this.frame_) {
        this.frame_.style.visibility = 'hidden';
    }
};

MarkerInfo.prototype.show = function () {

    if (this.frame_) {
        this.frame_.style.visibility = 'visible';
    }
};

MarkerInfo.prototype.toggle = function () {

    if (this.frame_) {
        if (this.frame_.style.visibility === 'hidden') {
            this.show();
        } else {
            this.hide();
        }
    }
};

MarkerInfo.prototype.onRemove = function () {

    this.frame_.parentNode.removeChild(this.frame_);
    this.frame_ = null;
};
