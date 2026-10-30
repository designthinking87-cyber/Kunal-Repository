import {existsSync} from 'node:fs';
import {Config} from '@remotion/cli/config';
if(existsSync('/usr/bin/chromium')) Config.setBrowserExecutable('/usr/bin/chromium');
Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
