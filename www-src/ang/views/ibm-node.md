<!-- Licensed under the Apache License. See footer for details. -->

IBM is providing a version of node.js for download, called
"IBM SDK for Node.js".

The SDK can be downloaded from here:

<http://www.ibm.com/developerworks/web/nodesdk/>

By default, when you push a node application to BlueMix, it will use a buildpack
which installs the IBM SDK for node.js as the runtime.  See the
[how-to](/how-to) page for instructions on using an alternate buildpack, if you
need to use a different version of node.

When you push your app, you can tell if you're using the IBM SDK for node.js
as your runtime, as you will see the following line (or similar) in the log:

		-----> Installing IBM SDK for Node.js from admin cache

The IBM SDK for node.js supports generating core dumps that can be
analyzed with the
[Interactive Diagnostic Data Explorer](https://www.ibm.com/developerworks/community/groups/service/html/communityview?communityUuid=5efb4378-ebba-47da-8c0f-8841d669d0cc).

You can post questions about the SDK, here:

<https://www.ibm.com/developerworks/community/groups/community/node>

If you'd like to follow along with the development work IBM is doing in node
and v8, checkout the following git repos:

* <https://github.com/andrewlow/v8ppc>
* <https://github.com/andrewlow/node>

<!--
#===============================================================================
# Copyright IBM Corp. 2014
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#===============================================================================
-->