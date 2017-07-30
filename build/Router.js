'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createHashHistory = require('history/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Modules */


var urlMatch = require('url-match');

var Router = function (_Component) {
  _inherits(Router, _Component);

  function Router(props) {
    _classCallCheck(this, Router);

    var _this = _possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).call(this, props));

    _this.state = {
      routes: [],
      router: { pathProps: {}, key: -1, pathname: "/" }
    };
    return _this;
  }

  _createClass(Router, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        redirect: this.redirect.bind(this)
      };
    }
  }, {
    key: 'processRoutes',
    value: function processRoutes(routes, parents) {
      var processedRoutes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var route = _step.value;

          var _components = {};
          var _props = {};
          var middleware = [];
          if (parents && parents[route.parent]) {
            _components = Object.assign({}, parents[route.parent].components, route.components);
            _props = Object.assign({}, parents[route.parent].props, route.props);
            middleware = [].concat(_toConsumableArray(parents[route.parent].middleware), _toConsumableArray(route.middleware));
          } else {
            _components = route.components;
            _props = route.props ? route.props : {};
            middleware = route.middleware ? route.middleware : [];
          }
          var path = urlMatch.generate(route.path);
          var processedRoute = _extends({}, route, { path: path, components: _components, props: _props, middleware: middleware });
          processedRoutes.push(processedRoute);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var catchallRoute = null;
      if (this.props.catchall) {
        var catchall = this.props.catchall;
        var components = {};
        var props = {};
        //let middleware = [];
        if (parents && parents[catchall.parent]) {
          components = Object.assign({}, parents[catchall.parent].components, catchall.components);
          props = Object.assign({}, parents[catchall.parent].props, catchall.props);
          //middleware = [...parents[catchall.parent].middleware, ...catchall.middleware];
        } else {
          components = catchall.components;
          props = catchall.props ? catchall.props : {};
          //middleware = catchall.middleware ? catchall.middleware : [];
        }
        catchallRoute = _extends({}, catchall, { components: components, props: props });
      }
      this.setState({ routes: processedRoutes, catchall: catchallRoute }, this.handleUrl);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.processRoutes(this.props.routes, this.props.parents);
      if (this.props.hash) {
        this.history = (0, _createHashHistory2.default)();
      } else {
        this.history = (0, _createBrowserHistory2.default)();
      }
      this.unlisten = this.history.listen(function (location, action) {
        _this2.handleUrl();
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unlisten();
    }
  }, {
    key: 'handleUrl',
    value: function handleUrl() {
      var pathname = this.history.location.pathname + this.history.location.search;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.state.routes.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              i = _step2$value[0],
              route = _step2$value[1];

          var pathProps = route.path.match(pathname);
          if (pathProps) {
            var _state$routes$i = this.state.routes[i],
                props = _state$routes$i.props,
                middleware = _state$routes$i.middleware;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = middleware[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var func = _step3.value;

                if (!func(this.redirect.bind(this), { pathProps: pathProps, pathname: pathname, history: this.history }, props)) {
                  return null;
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            this.setState({ router: { pathProps: pathProps, key: i, pathname: pathname } });
            return true;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.setState({ router: { pathProps: {}, key: -1, pathname: pathname } });
      return false;
    }
  }, {
    key: 'redirect',
    value: function redirect(href, replace) {
      if (replace) {
        this.history.replace(href);
      } else {
        this.history.push(href);
      }
      this.forceUpdate();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _state$router = this.state.router,
          pathProps = _state$router.pathProps,
          key = _state$router.key,
          pathname = _state$router.pathname;

      if (key === -1 && this.state.catchall) {
        var _state$catchall = this.state.catchall,
            components = _state$catchall.components,
            props = _state$catchall.props;
      } else if (key === -1) {
        return _react2.default.createElement(
          'div',
          null,
          'Could not find a match for ',
          pathname,
          ', maybe include a catchall route :)'
        );
      } else {
        var _state$routes$key = this.state.routes[key],
            components = _state$routes$key.components,
            props = _state$routes$key.props;
      }
      /* Other render */
      var otherRender = void 0;
      if (components.other && components.other.length > 0) {
        otherRender = components.other.map(function (component, i) {
          return _react2.default.createElement(component.component, _extends({}, Object.assign({}, props, component.props), { router: {
              pathProps: pathProps,
              key: key,
              pathname: pathname,
              redirect: _this3.redirect
            },
            key: 'OTHERCOMPONENT_' + i }));
        });
      }
      return _react2.default.createElement(
        'div',
        { className: 'router' },
        components.header && _react2.default.createElement(components.header.component, _extends({}, Object.assign({}, props, components.header.props), { router: {
            pathProps: pathProps,
            key: key,
            pathname: pathname,
            redirect: this.redirect
          } })),
        components.sidebar && _react2.default.createElement(components.sidebar.component, _extends({}, Object.assign({}, props, components.sidebar.props), { router: {
            pathProps: pathProps,
            key: key,
            pathname: pathname,
            redirect: this.redirect
          } })),
        components.notification && _react2.default.createElement(components.notification.component, _extends({}, Object.assign({}, props, components.notification.props), { router: {
            pathProps: pathProps,
            key: key,
            pathname: pathname,
            redirect: this.redirect
          } })),
        components.body && _react2.default.createElement(components.body.component, _extends({}, Object.assign({}, props, components.body.props), { router: {
            pathProps: pathProps,
            key: key,
            pathname: pathname,
            redirect: this.redirect
          } })),
        otherRender,
        components.footer && _react2.default.createElement(components.footer.component, _extends({}, Object.assign({}, props, components.footer.props), { router: {
            pathProps: pathProps,
            key: key,
            pathname: pathname,
            redirect: this.redirect
          } }))
      );
    }
  }]);

  return Router;
}(_react.Component);

Router.propTypes = {
  parents: _propTypes2.default.object.isRequired,
  routes: _propTypes2.default.array.isRequired
};
Router.childContextTypes = {
  redirect: _propTypes2.default.func.isRequired
};
exports.default = Router;