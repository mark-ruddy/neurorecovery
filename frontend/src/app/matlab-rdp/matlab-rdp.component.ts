import { Component, OnInit } from '@angular/core';
import { RemoteDesktopManager } from 'ngx-remote-desktop';
import { WebSocketTunnel } from '@illgrenoble/guacamole-common-js';

@Component({
  selector: 'app-matlab-rdp',
  templateUrl: './matlab-rdp.component.html',
  styleUrls: ['./matlab-rdp.component.scss']
})
export class MatlabRdpComponent implements OnInit {
  manager: RemoteDesktopManager | null = null;

  constructor() { }

  ngOnInit(): void {
    const tunnel = new WebSocketTunnel('ws://localhost:4200');
    this.manager = new RemoteDesktopManager(tunnel);
    const parameters = {
      // TODO: host my own RDP server on AWS and try it here
      ip: 'matlab-azure-hycrgjzwb7ai4.ukwest.cloudapp.azure.com',
      port: 3389,
      type: 'rdp',
      image: 'image/png',
      width: window.screen.width,
      height: window.screen.height,
    };
    this.manager.connect(parameters);
  }

}
