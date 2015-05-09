var page = require('webpage').create()
  , system = require('system')
  , url = system.args[1]
  , path = system.args[2]
  , size = system.args[3] || '';

if (!url) throw new Error('url required');
if (!path) throw new Error('output path required');

size = size.split('x');

page.viewportSize = {
    width: ~~size[0] || 1024
  , height: ~~size[1] || 600
};

page.open(url, function (status) {
  if (status == 'success') {
    page.render(path);
    phantom.exit();
  } else {
    throw new Error('failed to load ' + url);
  }
});