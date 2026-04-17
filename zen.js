'use strict';

module.exports = (game, opts) => new ZenPlugin(game, opts);
module.exports.pluginInfo = {
  clientOnly: true,
  loadAfter: ['mrcorpt-keys']
};

class ZenPlugin {
  constructor(game, opts) {
    this.game = game;
    this.keys = game.plugins.get('mrcorpt-keys');
    if (!this.keys) throw new Error('mrcorpt-zen requires mrcorpt-keys plugin');

    this.zenMode = false;
    this.enable();
  }

  enter() {
    if (document.getElementById('logo')) document.getElementById('logo').style.visibility = 'hidden';
    if (document.getElementById('stats')) document.getElementById('stats').style.visibility = 'hidden';
    this.game.plugins.disable('mrcorpt-inventory-hotbar'); // TODO: add explicit method to toggle visibility instead of disabling entire plugin?
    this.game.plugins.disable('mrcorpt-voila');
    this.game.plugins.disable('mrcorpt-health-bar');
    if (this.getDatgui()) {
      this.getDatgui().style.visibility = 'hidden';
    }
    this.zenMode = true;
  }

  leave() {
    if (document.getElementById('logo')) document.getElementById('logo').style.visibility = '';
    if (document.getElementById('stats')) document.getElementById('stats').style.visibility = '';
    this.game.plugins.enable('mrcorpt-inventory-hotbar'); // TODO: remember state, only re-enable if was enabled first?
    this.game.plugins.enable('mrcorpt-voila');
    this.game.plugins.enable('mrcorpt-health-bar');
    if (this.getDatgui()) {
      this.getDatgui().style.visibility = '';
    }
    this.zenMode = false;
  }

  getDatgui() {
    const a = document.getElementsByClassName('dg'); // TODO: find out how dat.gui handle 'H' hotkey and Close Button, might do more than hiding? (tick listeners)
    if (a) return a[0];
  }

  toggle() {
    if (this.zenMode) {
      this.leave();
    } else {
      this.enter();
    }
  }

  enable() {
    this.keys.down.on('zen', this.down = () => {
      this.toggle();
    });
  }

  disable() {
    this.keys.down.remove('zen', this.down);
  }
}
