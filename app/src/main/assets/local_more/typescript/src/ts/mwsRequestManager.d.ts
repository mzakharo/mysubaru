// ==============================================
// declare 
// ==============================================
/**
 * unescape
 */
declare function unescape(value: string): string;
/**
 * escape
 */
declare function escape (value: string): string;

declare namespace mwsRequestManager {
    function initialize(callback: () => void);
    function getMWSRequestUrl(url: string);
    function getMWSUrl();
    function getMWSUrlWithoutPort();
    function getMWSPort();
}