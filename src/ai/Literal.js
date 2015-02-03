/**
 * Created by marco.gobbi on 02/02/2015.
 */
define(function (require) {
	"use strict";
	function Literal(value,sign){
		this.value=value;
		this.sign=sign;
		this.toString=function(){
			var s = "";
			if (!sign) {
				s += "!";
			}
			return s + value.toString();
		}
	}
	return Literal;
});