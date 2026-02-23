export class DetectorDevices {
  browser: string = '';
  browser_version: string = '';
  device: string = '';
  deviceType: string = '';
  orientation: string = '';
  os: string = '';
  os_version: string = '';
  userAgent: string = ''
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
