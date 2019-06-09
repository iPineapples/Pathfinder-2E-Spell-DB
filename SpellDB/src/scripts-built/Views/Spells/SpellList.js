'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SpellSearch = require('./SpellSearch.js');

var _SpellSearch2 = _interopRequireDefault(_SpellSearch);

var _SpellListItem = require('./SpellListItem.js');

var _SpellListItem2 = _interopRequireDefault(_SpellListItem);

var _SpellDetail = require('./SpellDetail.js');

var _SpellDetail2 = _interopRequireDefault(_SpellDetail);

var _immutabilityHelper = require('immutability-helper');

var _immutabilityHelper2 = _interopRequireDefault(_immutabilityHelper);

var _SpellLoader = require('../../SpellLoader.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
//import { ipcRenderer } from 'electron';


var _loadSpellData = (0, _SpellLoader.loadSpellData)(),
    spells = _loadSpellData.spells,
    spellTypes = _loadSpellData.spellTypes;

spellTypes.sort(function (lhs, rhs) {
    return lhs.name < rhs.name ? -1 : lhs.name > rhs.name ? 1 : 0;
});

var defaultMaxRows = 50;
var getDefaultCriteria = function getDefaultCriteria() {
    return {
        'spellName': '',
        'spellType': '',
        'spellOption': '',
        'sortBy': 'Level',
        'displayMode': 'Details',
        'levels': []
    };
};

var SpellList = function (_React$Component) {
    _inherits(SpellList, _React$Component);

    function SpellList(props) {
        _classCallCheck(this, SpellList);

        var _this = _possibleConstructorReturn(this, (SpellList.__proto__ || Object.getPrototypeOf(SpellList)).call(this, props));

        _this.state = {
            spellTypes: spellTypes,
            spells: spells,
            maxRows: defaultMaxRows,
            criteria: getDefaultCriteria(),
            selectedSpell: null,
            bookmarkLists: _this.props.bookmarkManager.getBookmarkLists(),
            activeBookmarkList: _this.props.bookmarkManager.getActiveBookmarkList()
        };
        _this.state.spellTypes.forEach(function (st) {
            if (st.matchBy == "bookmark") st.options = _this.state.bookmarkLists.map(function (l) {
                return { "name": l.name, "value": l.id };
            });
        });
        _this.criteriaReset = _this.criteriaReset.bind(_this);
        _this.criteriaChange = _this.criteriaChange.bind(_this);
        _this.criteriaSort = _this.criteriaSort.bind(_this);
        _this.meetsCriteria = _this.meetsCriteria.bind(_this);
        _this.selectSpell = _this.selectSpell.bind(_this);
        _this.showMore = _this.showMore.bind(_this);
        _this.isBookmarked = _this.isBookmarked.bind(_this);
        _this.bookmarkSpell = _this.bookmarkSpell.bind(_this);

        _this.bookmarkListUpdate = _this.bookmarkListUpdate.bind(_this);
        _this.activeBookmarkListUpdate = _this.activeBookmarkListUpdate.bind(_this);

        _this.props.bookmarkManager.on(_this.props.bookmarkManager.events.dataUpdate, _this.bookmarkListUpdate);
        _this.props.bookmarkManager.on(_this.props.bookmarkManager.events.activeListUpdate, _this.activeBookmarkListUpdate);
        _this.componentWillUnmount = function () {
            this.props.bookmarkManager.off(this.props.bookmarkManager.events.dataUpdate, this.bookmarkListUpdate);
            this.props.bookmarkManager.off(this.props.bookmarkManager.events.activeListUpdate, this.activeBookmarkListUpdate);
        }.bind(_this);
        return _this;
    }

    _createClass(SpellList, [{
        key: 'bookmarkListUpdate',
        value: function bookmarkListUpdate(ev, args) {
            var _this2 = this;

            var types = JSON.parse(json.stringify(this.state.spellTypes));
            types.forEach(function (st) {
                if (st.matchBy == "bookmark") st.options = _this2.state.bookmarkLists.map(function (l) {
                    return { "name": l.name, "value": l.id };
                });
            });
            this.setState({
                "bookmarkLists": args,
                "spellTypes": types
            });
        }
    }, {
        key: 'activeBookmarkListUpdate',
        value: function activeBookmarkListUpdate(ev, args) {
            this.setState({
                "activeBookmarkList": args
            });
        }
    }, {
        key: 'isBookmarked',
        value: function isBookmarked(spell) {
            return !!(this.state.activeBookmarkList && this.state.activeBookmarkList.spells[spell.name]);
        }
    }, {
        key: 'bookmarkSpell',
        value: function bookmarkSpell(spell) {
            this.props.bookmarkManager.toggleSpell(spell.name);
        }
    }, {
        key: 'showMore',
        value: function showMore() {
            this.setState(function (s) {
                return { 'maxRows': s.maxRows + defaultMaxRows };
            });
        }
    }, {
        key: 'meetsCriteria',
        value: function meetsCriteria(spell) {
            var _this3 = this;

            if (this.state.criteria.spellName) {
                if (spell.name.toLowerCase().indexOf(this.state.criteria.spellName.toLowerCase()) === -1) return false;
            }
            if (this.state.criteria.spellType && this.state.criteria.spellOption) {
                var spellType = this.state.spellTypes.find(function (t) {
                    return t.name == _this3.state.criteria.spellType;
                });
                switch (spellType.matchBy) {
                    case "bookmark":
                        var list = this.state.bookmarkLists.find(function (l) {
                            return l.id === _this3.state.criteria.spellOption;
                        });
                        if (list && !list.spells[spell.name]) return false;
                        break;
                    case "array":
                        return spell[spellType.match] && spell[spellType.match].indexOf(this.state.criteria.spellOption) != -1;
                }
            }
            if (this.state.criteria.levels.length > 0 && this.state.criteria.levels.indexOf(spell.level) === -1) return false;

            return true;
        }
    }, {
        key: 'selectSpell',
        value: function selectSpell(spell) {
            this.setState({
                selectedSpell: spell
            });
        }
    }, {
        key: 'criteriaReset',
        value: function criteriaReset() {
            var newCriteria = getDefaultCriteria();
            newCriteria.displayMode = this.state.criteria.displayMode;
            this.setState({
                criteria: newCriteria
            });
        }
    }, {
        key: 'criteriaChange',
        value: function criteriaChange(name, value) {
            if (name === "spellType") {
                var _update;

                var spellOption = "";
                var spellType = this.state.spellTypes.find(function (t) {
                    return t.name == value;
                });
                if (spellType && spellType.matchBy == "bookmark") spellOption = this.state.activeBookmarkList.name;
                this.setState({
                    criteria: (0, _immutabilityHelper2.default)(this.state.criteria, (_update = {}, _defineProperty(_update, name, { $set: value }), _defineProperty(_update, 'spellOption', { $set: spellOption }), _update)),
                    maxRows: defaultMaxRows
                });
            } else {
                this.setState({
                    criteria: (0, _immutabilityHelper2.default)(this.state.criteria, _defineProperty({}, name, { $set: value })),
                    maxRows: defaultMaxRows
                });
            }
        }
    }, {
        key: 'criteriaSort',
        value: function criteriaSort(lhs, rhs) {
            switch (this.state.criteria.sortBy) {
                case "Name":
                    if (lhs.name.toLowerCase() < rhs.name.toLowerCase()) return -1;
                    if (lhs.name.toLowerCase() > rhs.name.toLowerCase()) return 1;
                    return 0;
                case "Level":
                    if (lhs.level - rhs.level != 0) return lhs.level - rhs.level;
                    if (lhs.name.toLowerCase() < rhs.name.toLowerCase()) return -1;
                    if (lhs.name.toLowerCase() > rhs.name.toLowerCase()) return 1;
                    break;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var visibleSpells = this.state.spells.filter(this.meetsCriteria).sort(this.criteriaSort);
            var truncated = false;
            if (visibleSpells.length > this.state.maxRows) {
                visibleSpells = visibleSpells.slice(0, this.state.maxRows);
                truncated = true;
            }

            var selectedSpell = this.state.selectedSpell;
            if ((!selectedSpell || !this.meetsCriteria(selectedSpell)) && visibleSpells.length > 0) selectedSpell = visibleSpells[0];

            var detail = null;
            if (selectedSpell && this.state.criteria.displayMode == 'List') detail = _react2.default.createElement(
                'div',
                { className: 'col-sm selectedSpell' },
                _react2.default.createElement(_SpellDetail2.default, { spell: selectedSpell,
                    bookmarked: this.isBookmarked(selectedSpell),
                    onBookmark: this.bookmarkSpell
                })
            );
            return _react2.default.createElement(
                'div',
                { className: 'container' },
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col-sm' },
                        _react2.default.createElement(_SpellSearch2.default, {
                            spellTypes: this.state.spellTypes,
                            sortOptions: ["Name", "Level"],
                            displayModes: ["List", "Details"],
                            spellType: this.state.criteria.spellType,
                            spellOption: this.state.criteria.spellOption,
                            spellName: this.state.criteria.spellName,
                            sortBy: this.state.criteria.sortBy,
                            levels: this.state.criteria.levels,
                            displayMode: this.state.criteria.displayMode,
                            showDetails: this.state.criteria.showDetails,
                            onCriteriaChange: this.criteriaChange,
                            onCriteriaReset: this.criteriaReset
                        })
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                        'div',
                        { className: "col-sm spellList" + this.state.criteria.displayMode },
                        _react2.default.createElement(
                            'ul',
                            { className: 'list-group' },
                            visibleSpells.map(function (s) {
                                if (_this4.state.criteria.displayMode == "Details") return _react2.default.createElement(_SpellDetail2.default, {
                                    key: s.name,
                                    spell: s,
                                    bookmarked: _this4.isBookmarked(s),
                                    onBookmark: _this4.bookmarkSpell
                                });else return _react2.default.createElement(_SpellListItem2.default, {
                                    key: s.name,
                                    spell: s,
                                    selected: s == selectedSpell,
                                    onSelect: _this4.selectSpell
                                });
                            }),
                            truncated ? _react2.default.createElement(
                                'li',
                                { className: 'list-group-item list-group-item-info' },
                                _react2.default.createElement(
                                    'a',
                                    { onClick: this.showMore },
                                    'Show More...'
                                )
                            ) : null
                        )
                    ),
                    detail
                )
            );
        }
    }]);

    return SpellList;
}(_react2.default.Component);

exports.default = SpellList;
;