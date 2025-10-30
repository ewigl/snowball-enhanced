// ==UserScript==
// @name        雪球工具
// @namespace   https://github.com/ewigl/snowball-enhanced
// @match       http*://xueqiu.com/*
// @grant       unsafeWindow
// @version     0.1
// @author      Licht
// @description 雪球工具
// ==/UserScript==

(function () {
  "use strict";

  const utils = {
    saveAsTextFile(content, filename, fileExtension) {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.${fileExtension}`;
      link.click();
      URL.revokeObjectURL(url);
    },
    getFollowedUsers() {
      const userData = [];

      $(".profiles__user__card").each(function (_index, element) {
        const $card = $(element);

        const username = $card.find(".user-name").text().trim();

        let href = $card.find(".profiles__user__card__content a").attr("href");

        if (!href) {
          href = $card.find("a:first").attr("href");
        }

        userData.push({
          username: username,
          href: `https://xueqiu.com/u${href}`,
        });
      });

      return userData;
    },
    getStockData() {
      const stockData = [];

      $(".optional_stocks tbody tr.sortable").each(function () {
        const $row = $(this);

        const name = $row.find("a.name").text().trim();

        const code = $row.find("a.code span").text().trim();

        if (name && code) {
          stockData.push({
            name,
            code,
          });
        }
      });

      return stockData;
    },
  };

  const operations = {
    exportFollowedUsers() {
      const users = utils.getFollowedUsers();
      const content = users
        .map((user) => `${user.username}\t${user.href}`)
        .join("\n");
      utils.saveAsTextFile(content, "users", "txt");
    },
    exportStockData() {
      const stocks = utils.getStockData();
      const content = stocks
        .map((stock) => `${stock.name}\t${stock.code}`)
        .join("\n");
      utils.saveAsTextFile(content, "stocks", "txt");
    },
  };

  const main = {
    init() {
      unsafeWindow.exportFollowedUsers = operations.exportFollowedUsers;
      unsafeWindow.exportStockData = operations.exportStockData;
    },
  };

  main.init();
})();
