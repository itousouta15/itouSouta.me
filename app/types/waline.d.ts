/* @waline/client 的 ./style 子路徑在 exports map 裡只有 CSS 沒有 types，
   Next 也只宣告 *.module.css，這裡補一個 side-effect import 的宣告。 */
declare module "@waline/client/style";
