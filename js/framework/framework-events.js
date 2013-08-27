/**
 * framework-events.js
 *
 * Author: Max Lynch <max@drifty.com>
 *
 * Framework events handles various mobile browser events, and 
 * detects special events like tap/swipe/etc. and emits them
 * as custom events that can be used in an app.
 *
 * Portions lovingly adapted from github.com/maker/ratchet and github.com/alexgibson/tap.js - thanks guys!
 */

(function(window, document, framework) {
  framework.EventController = {

    // Trigger a new event
    trigger: function(eventType, data) {
      // TODO: Do we need to use the old-school createEvent stuff?
      var event = new CustomEvent(eventType, data);

      // Make sure to trigger the event on the given target, or dispatch it from
      // the window if we don't have an event target
      data.target && data.target.dispatchEvent(event) || window.dispatchEvent(event);
    },
  
    // Bind an event
    on: function(type, callback, element) {
      var e = element || window;
      e.addEventListener(type, callback);
    },

    // Register for a new gesture event on the given element
    onGesture: function(type, callback, element) {
      var listener = new framework.GestureListener(type, callback, element);
      framework.GestureListener.addListener(listener);
      return listener;
    },

    // Unregister a previous gesture event
    offGesture: function(listener) {
      framework.GestureController.removeListener(listener);
    },

    // With a click event, we need to check the target
    // and if it's an internal target that doesn't want
    // a click, cancel it
    handleClick: function(e) {
      var target = e.target;

      if (
        !  target
        || e.which > 1
        || e.metaKey
        || e.ctrlKey
        //|| isScrolling
        || location.protocol !== target.protocol
        || location.host     !== target.host
        // Not sure abotu this one
        //|| !target.hash && /#/.test(target.href)
        || target.hash && target.href.replace(target.hash, '') === location.href.replace(location.hash, '')
        //|| target.getAttribute('data-ignore') == 'push'
      ) {
        // Allow it
        console.log("EVENT: click", e);
        return;
      }
      // We need to cancel this one
      e.preventDefault();

      // TODO: should we do this?
      // e.stopPropagation();
    },
    
    handlePopState: function(event) {
      console.log("EVENT: popstate", event);
    },
  };
  
  
  // Map some convenient top-level functions for event handling
  framework.on = framework.EventController.on;
  framework.trigger = framework.EventController.trigger;

  // Set up various listeners
  window.addEventListener('click', framework.EventController.handleClick);
  window.addEventListener('popstate', framework.EventController.handlePopState);

})(this, document, FM = this.FM || {});
