/**
 * Matchers pour jquery
 */
var jqueryMatchers = {
    toExist : function() {
        return {
            compare : function(selector) {
                return {
                    pass : $(selector).length
                }
            }
        }
    },
    toNotExist : function() {
        return {
            compare : function(selector) {
                return {
                    pass : $(selector).length === 0
                }
            }
        }
    },
    toBeVisible : function() {
        return {
            compare : function(selector) {
                return {
                    pass : $(selector).is(':visible')
                }
            }
        }
    },

    toBeHidden : function() {
        return {
            compare : function(selector) {
                return {
                    pass : $(selector).is(':hidden')
                }
            }
        }
    },
    toHaveValue : function() {
        return {
            compare : function(selector, value) {
                var actualValue = $(selector).val();
                var message = "Expected '"+selector+"' ";
                var pass = (actualValue == value);
                if (pass) {
                    message += " not to have value '"+value+"'";
                } else {
                    message += " to have value '"+value+"' but was '"+actualValue+"'";
                }
                return {
                    pass : pass,
                    message: message
                }
            }
        }
    },
    toHaveText : function() {
        return {
            compare : function(selector, text) {
                var selectorText = $(selector).text()
                var trimmedText = $.trim(selectorText)
                var message;

                if (text && $.isFunction(text.test)) {
                    return {
                        pass : text.test(selectorText) || text.test(trimmedText)
                    }
                } else {
                    var pass = (selectorText == text || trimmedText == text);
                    message = "Expected '"+selector+"' ";
                    if (pass) {
                        message += " not to have text '"+text+"'";
                    } else {
                        message += " to have text '"+text+"' but was '"+selectorText+"'";
                    }
                    return {
                        pass : pass,
                        message: message
                    }
                }
            }
        }
    },
    toBeChecked : function() {
        return {
            compare : function(selector) {
                return {
                    pass : $(selector).is(':checked')
                }
            }
        }
    },
    toBeSelected : function() {
        return {
            compare : function(selector) {
                return {
                    pass : $(selector).is(':selected')
                }
            }
        }
    },
    toBeDisabled: function() {
        return {
            compare : function(selector) {
                return {
                    pass : $(selector).is(':disabled')
                }
            }
        }
    },
    toHaveClass: function() {
        return {
            compare : function(selector, className) {
                return {
                    pass : $(selector).hasClass(className)
                }
            }
        }
    },
    toHaveAttr: function() {
        return {
            compare : function(selector, attrName, expectedAttrValue) {
                var $e = $(selector),
                    actualAttrValue = $e.attr(attrName),
                    res = false;
                if (expectedAttrValue === undefined) {
                    res = (actualAttrValue !== undefined);
                } else {
                    res = (expectedAttrValue === actualAttrValue);
                }
                return {
                    pass : res
                }
            }
        }
    },
    toNotHaveAttr: function() {
        return {
            compare : function(selector, attrName) {
                var $e = $(selector),
                    actualAttrValue = $e.attr(attrName),
                    res = false;
                res = (actualAttrValue === undefined || !actualAttrValue);
                return {
                    pass : res
                }
            }
        }
    }
};