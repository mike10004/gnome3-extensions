/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

/*
 * Copyright © 2015 Mike Chaberski
 * Copyright © 2014 Sriram Ramkrishna
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the licence, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Mike Chaberski <mike10004@users.noreply.github.com>
 */

/*
 * Simple extension to add a logout button to the panel.
 */

const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Shell = imports.gi.Shell;
const St = imports.gi.St;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const Main = imports.ui.main;
const GnomeSession = imports.misc.gnomeSession;
const LOGOUT_MODE_NORMAL = 0;
let _logoutButton = null;
let baseGIcon;
let hoverGIcon;
let buttonIcon;

function init() {

  _logoutButton = new St.Bin({ style_class: 'panel-button',
                reactive: true,
                can_focus: true,
                x_fill: true,
                y_fill: false,
                track_hover: true });
  // credit: http://stackoverflow.com/questions/20394840/how-to-set-a-png-file-in-a-gnome-shell-extension-for-st-icon
  baseGIcon = Gio.icon_new_for_string(Me.path + "/icons/logout-base.svg");
  hoverGIcon = Gio.icon_new_for_string(Me.path + "/icons/logout-hover.svg");
  buttonIcon = new St.Icon({
    'gicon': Gio.icon_new_for_string(Me.path + "/icons/logout-base.svg"),
    'style_class': 'system-status-icon'
  });

  _logoutButton.set_child(buttonIcon);
  _logoutButton.connect('button-press-event', _DoLogout);
  _logoutButton.connect('enter-event', function() {
    _SetButtonIcon('hover');
  });
  _logoutButton.connect('leave-event', function(){
    _SetButtonIcon('base');
  });

}

function _DoLogout () {
  global.log("logoutbutton:_DoLogout");
  var sessionManager = new GnomeSession.SessionManager();
  sessionManager.LogoutRemote(LOGOUT_MODE_NORMAL);
}

function enable () {
  Main.panel._rightBox.insert_child_at_index(_logoutButton,0);
}

function disable () {
  Main.panel._rightBox.remove_actor(_logoutButton);
}

function _SetButtonIcon(mode) {
  if (mode === 'hover') {
    buttonIcon.set_gicon(hoverGIcon);
  } else {
    buttonIcon.set_gicon(baseGIcon);
  }
}
