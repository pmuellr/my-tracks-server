# Licensed under the Apache License. See footer for details.

titlePrefix = "node stuff @ bluemix"

AngTangle.controller ($scope,  $document, $location, data) ->

  domReady = false

  $ ->
    domReady = true

  $scope.pkg         = data.package
  $scope.titlePrefix = titlePrefix
  $scope.subtitle    = ""

  # update stuff on route change
  $scope.$on "$routeChangeSuccess", (next, current) ->

    $(".navbar-collapse").collapse("hide") if domReady

    setTitle $scope, $document, $location

    sendGoogleAnalytics()

#-------------------------------------------------------------------------------
setTitle = ($scope, $document, $location) ->
  match = $location.path().match(/\/(.*)/)
  return unless match
  subtitle = match[1].replace(/-/g, " ")

  if subtitle is ""
    title    = titlePrefix
  else
    subtitle = ": #{subtitle}"
    title    = "#{titlePrefix}#{subtitle}"

  $document[0].title = title
  $scope.subtitle    = subtitle

#-------------------------------------------------------------------------------
sendGoogleAnalytics = ->
  try
    ga("send", "pageview")
  catch err
    # ignore


#-------------------------------------------------------------------------------
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
#-------------------------------------------------------------------------------
