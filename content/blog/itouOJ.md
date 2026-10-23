---
title: itouOJ 題解
slug: itouOJ
date: '2026-10-23T12:00:00+08:00'
categories:
  - 技術分享
tags:
  - itouOJ
  - 題解
cover: /assets/projects/itouOJ.webp
description: itouOJ a001 到 a085 的解題思路、複雜度與程式
deferredHighlight: true
searchCode: false
prefetch: false
---

這篇整理 [itouOJ](https://oj.itousouta.me/problems) 的 a001～a085 的題解；題目敘述與測資限制以連結中的原題為準。範例以 `int`、`long long`、`string`、陣列與一般 `for` 迴圈為主；只有題目需要時才使用佇列、堆疊等容器。

## a001. 哈囉，資訊！

[原題](https://oj.itousouta.me/problems/a001)｜依格式帶入姓名和年齡。時間、額外空間皆為 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string name; int age;
    cin >> name >> age;
    cout << "Hello, my name is " << name << ". I am " << age << " years old!\n";
}
```

## a002. 幫 Jason 應援

[原題](https://oj.itousouta.me/problems/a002)｜沒有輸入。注意使用全形驚嘆號 `！`，三句之間各一個半形空白。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    cout << "Leeseo！ Leeseo！ Leeseo！\n";
}
```

## a003. 班級點名卡

[原題](https://oj.itousouta.me/problems/a003)｜括號要用全形 `（`、`）`。時間 O(|name|)、空間 O(|name|)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string name; int seat; char group;
    cin >> name >> seat >> group;
    cout << seat << " 號 " << name << "（" << group << " 組）\n";
}
```

## a004. 攝氏轉華氏

[原題](https://oj.itousouta.me/problems/a004)｜用浮點數計算 `C * 9 / 5 + 32`，避免整數除法。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    double c; cin >> c;
    cout << c * 9.0 / 5 + 32 << '\n';
}
```

## a005. 奇數還是偶數

[原題](https://oj.itousouta.me/problems/a005)｜範圍可達 10¹⁸，用 `long long`。負數也可直接以 `% 2 == 0` 判偶數。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    long long n; cin >> n;
    cout << (n % 2 == 0 ? "Even" : "Odd") << '\n';
}
```

## a006. 三數最大值

[原題](https://oj.itousouta.me/problems/a006)｜三數直接取最大值，負數也適用。時間、空間 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b, c; cin >> a >> b >> c;
    int answer = a;
    if (b > answer) answer = b;
    if (c > answer) answer = c;
    cout << answer << '\n';
}
```

## a007. 果汁哪杯比較划算？

[原題](https://oj.itousouta.me/problems/a007)｜讀取兩杯的容量與價格，將容量換成百分之一公升的整數，再交叉相乘比較單價，避免浮點誤差。時間、空間 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    double a, b; long long pa, pb;
    cin >> a >> pa >> b >> pb;
    long long ca = (long long)(a * 100 + 0.5);
    long long cb = (long long)(b * 100 + 0.5);
    long long x = pa * cb, y = pb * ca;
    cout << (x < y ? "A" : x > y ? "B" : "Same") << '\n';
}
```

## a008. 簡易計算機

[原題](https://oj.itousouta.me/problems/a008)｜先檢查除以零；C++ 的整數除法會向零截斷。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    long long a, b; char op;
    cin >> a >> op >> b;
    if (op == '+') cout << a + b;
    else if (op == '-') cout << a - b;
    else if (op == '*') cout << a * b;
    else if (b == 0) cout << "Error";
    else cout << a / b;
    cout << '\n';
}
```

## a009. BMI 分級

[原題](https://oj.itousouta.me/problems/a009)｜公分換成公尺後計算 BMI，按門檻由低到高分類。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    double weight, height; cin >> weight >> height;
    double h = height / 100, bmi = weight / (h * h);
    if (bmi < 18.5) cout << "過輕";
    else if (bmi < 24) cout << "正常";
    else if (bmi < 27) cout << "過重";
    else cout << "肥胖";
    cout << '\n';
}
```

## a010. 累加與累乘

[原題](https://oj.itousouta.me/problems/a010)｜從 1 到 n 同時計算總和與總乘積；乘積用 64 位元。時間 O(n)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n; cin >> n;
    long long sum = 0, product = 1;
    for (int i = 1; i <= n; ++i) { sum += i; product *= i; }
    cout << sum << '\n' << product << '\n';
}
```

## a011. 質數判斷

[原題](https://oj.itousouta.me/problems/a011)｜只需試除到平方根；條件 `d <= n / d` 不會乘法溢位。時間 O(√n)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n; cin >> n;
    bool prime = n >= 2;
    for (int d = 2; d <= n / d; ++d)
        if (n % d == 0) { prime = false; break; }
    cout << (prime ? "Prime" : "Not Prime") << '\n';
}
```

## a012. 數字翻轉

[原題](https://oj.itousouta.me/problems/a012)｜逐次取個位並加入答案，反轉後的前導零自然會消失。時間 O(位數)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    long long n, reversed = 0; cin >> n;
    while (n) { reversed = reversed * 10 + n % 10; n /= 10; }
    cout << reversed << '\n';
}
```

## a013. 九九乘法表

[原題](https://oj.itousouta.me/problems/a013)｜固定印出 1 到 9 倍，留意 `x` 與 `=` 兩側的空白。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n; cin >> n;
    for (int i = 1; i <= 9; ++i)
        cout << n << " x " << i << " = " << n * i << '\n';
}
```

## a014. 直角三角形

[原題](https://oj.itousouta.me/problems/a014)｜第 i 行輸出 i 顆星。時間 O(n²)、額外空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n; cin >> n;
    for (int i = 1; i <= n; ++i) {
        for (int j = 0; j < i; ++j) cout << '*';
        cout << '\n';
    }
}
```

## a015. 菱形圖案（進階）

[原題](https://oj.itousouta.me/problems/a015)｜以中間一行為對稱軸，離中間越遠，前置空白越多，星號越少。時間 O(n²)、額外空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n; cin >> n;
    for (int i = 0; i < n; ++i) {
        int spaces = i <= n / 2 ? n / 2 - i : i - n / 2;
        for (int j = 0; j < spaces; ++j) cout << ' ';
        for (int j = 0; j < n - 2 * spaces; ++j) cout << '*';
        cout << '\n';
    }
}
```

## a016. 最大最小平均

[原題](https://oj.itousouta.me/problems/a016)｜逐項更新最大值、最小值與總和，平均值固定印兩位小數。時間 O(n)、空間 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    long long sum = 0; int lo = INT_MAX, hi = INT_MIN;
    for (int i = 0, x; i < n; ++i) {
        cin >> x;
        sum += x;
        if (x < lo) lo = x;
        if (x > hi) hi = x;
    }
    cout << hi << '\n' << lo << '\n'
         << fixed << setprecision(2) << double(sum) / n << '\n';
}
```

## a017. 矩陣加總

[原題](https://oj.itousouta.me/problems/a017)｜邊讀邊加，不需要儲存矩陣。時間 O(nm)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    long long sum = 0, x;
    for (int i = 0; i < n * m; ++i) { cin >> x; sum += x; }
    cout << sum << '\n';
}
```

## a018. 九宮格驗證

[原題](https://oj.itousouta.me/problems/a018)｜題目只要求各列、各行和兩條對角線的**總和相同**，沒有要求數字互異。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int a[3][3];
    for (int i = 0; i < 3; ++i)
        for (int j = 0; j < 3; ++j) cin >> a[i][j];
    int target = a[0][0] + a[0][1] + a[0][2];
    bool ok = true;
    for (int i = 0; i < 3; ++i) {
        if (a[i][0] + a[i][1] + a[i][2] != target) ok = false;
        if (a[0][i] + a[1][i] + a[2][i] != target) ok = false;
    }
    if (a[0][0] + a[1][1] + a[2][2] != target) ok = false;
    if (a[0][2] + a[1][1] + a[2][0] != target) ok = false;
    cout << (ok ? "Magic" : "Not Magic") << '\n';
}
```

## a019. 子字串搜尋

[原題](https://oj.itousouta.me/problems/a019)｜逐一嘗試 t 在 s 中可能的起點，再逐字比對。以長度 n、m 計，時間 O(nm)、空間 O(n+m)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, t; cin >> s >> t;
    bool found = false;
    for (int i = 0; i + (int)t.size() <= (int)s.size(); ++i) {
        bool same = true;
        for (int j = 0; j < (int)t.size(); ++j)
            if (s[i + j] != t[j]) same = false;
        if (same) found = true;
    }
    cout << (found ? "Yes" : "No") << '\n';
}
```

## a020. 迴文判斷

[原題](https://oj.itousouta.me/problems/a020)｜從兩端往中間比對，任一對不同就不是迴文。時間 O(n)、額外空間 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; cin >> s;
    bool same = true;
    for (int i = 0; i < (int)s.size() / 2; ++i)
        if (s[i] != s[s.size() - 1 - i]) same = false;
    cout << (same ? "Yes" : "No") << '\n';
}
```

## a021. A + B Problem

[原題](https://oj.itousouta.me/problems/a021)｜兩數各可達 10⁹，總和可能超過 32 位元有號整數。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    long long a, b; cin >> a >> b;
    cout << a + b << '\n';
}
```

## a022. 字串反轉

[原題](https://oj.itousouta.me/problems/a022)｜從最後一個字元依序往前輸出，大小寫與數字照原樣保留。時間 O(n)、額外空間 O(1)。

```cpp
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s; cin >> s;
    for (int i = (int)s.size() - 1; i >= 0; --i) cout << s[i];
    cout << '\n';
}
```

## a023. 成績等第統計

[原題](https://oj.itousouta.me/problems/a023)｜由高到低判斷門檻，60 分歸 D，低於 60 分才歸 F。時間 O(n)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n, count[5] = {}; cin >> n;
    for (int i = 0, score; i < n; ++i) {
        cin >> score;
        if (score >= 90) ++count[0];
        else if (score >= 80) ++count[1];
        else if (score >= 70) ++count[2];
        else if (score >= 60) ++count[3];
        else ++count[4];
    }
    const char grade[] = "ABCDF";
    for (int i = 0; i < 5; ++i) cout << grade[i] << ": " << count[i] << '\n';
}
```

## a024. 括號配對

[原題](https://oj.itousouta.me/problems/a024)｜堆疊保存尚未配對的左括號；右括號必須與堆疊頂端同型。時間 O(n)、空間 O(n)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, st; cin >> s;
    bool ok = true;
    for (int i = 0; i < (int)s.size(); ++i) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') st += c;
        else {
            char want = c == ')' ? '(' : c == ']' ? '[' : '{';
            if (st.empty() || st.back() != want) { ok = false; break; }
            st.pop_back();
        }
    }
    cout << (ok && st.empty() ? "Yes" : "No") << '\n';
}
```

## a025. 費氏數列

[原題](https://oj.itousouta.me/problems/a025)｜維護相鄰兩項，每次遞推時模 10⁹+7；n=0 也適用。時間 O(n)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n; cin >> n;
    long long a = 0, b = 1;
    for (int i = 0; i < n; ++i) {
        long long next = (a + b) % 1000000007;
        a = b; b = next;
    }
    cout << a << '\n';
}
```

## a026. 峰值偵測

[原題](https://oj.itousouta.me/problems/a026)｜頭尾只需與存在的鄰居比較；只有一個元素時也成立。時間 O(n)、空間 O(n)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    int a[1000];
    for (int i = 0; i < n; ++i) cin >> a[i];
    int count = 0;
    for (int i = 0; i < n; ++i)
        count += (i == 0 || a[i] > a[i - 1]) &&
                 (i + 1 == n || a[i] > a[i + 1]);
    cout << count << '\n';
}
```

## a027. 單字接龍

[原題](https://oj.itousouta.me/problems/a027)｜從起點 BFS，每次改一個字母；第一個字的長度是 1。字典未含終點時無法到達。令字典數 N、字長 L，時間 O(26NL)、空間 O(NL)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string start, goal, word; int n;
    cin >> start >> goal >> n;
    unordered_set<string> words;
    while (n--) { cin >> word; words.insert(word); }
    if (!words.count(goal)) { cout << 0 << '\n'; return 0; }
    queue<pair<string, int>> q;
    q.push({start, 1}); words.erase(start);
    while (!q.empty()) {
        string s = q.front().first;
        int steps = q.front().second;
        q.pop();
        if (s == goal) { cout << steps << '\n'; return 0; }
        for (int i = 0; i < (int)s.size(); ++i) {
            char old = s[i];
            for (char c = 'a'; c <= 'z'; ++c) {
                s[i] = c;
                if (words.erase(s)) q.push({s, steps + 1});
            }
            s[i] = old;
        }
    }
    cout << 0 << '\n';
}
```

## a028. 最大公因數

[原題](https://oj.itousouta.me/problems/a028)｜輾轉相除，兩數可達 10¹⁸。時間 O(log min(A,B))、空間 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long a, b; cin >> a >> b;
    cout << gcd(a, b) << '\n';
}
```

## a029. 0/1 背包

[原題](https://oj.itousouta.me/problems/a029)｜`dp[c]` 是容量不超過 c 可取得的最大價值；容量**倒序**更新，避免同一物品被拿多次。價值總和用 64 位元。時間 O(NW)、空間 O(W)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, W; cin >> n >> W;
    long long dp[10001] = {};
    while (n--) {
        int w; long long v; cin >> w >> v;
        for (int c = W; c >= w; --c)
            dp[c] = max(dp[c], dp[c - w] + v);
    }
    cout << dp[W] << '\n';
}
```

## a030. 最短路徑

[原題](https://oj.itousouta.me/problems/a030)｜非負權無向圖用 Dijkstra；同一點可能多次入堆，彈出過期距離時跳過。距離要用 `long long`，不可達輸出 -1。時間 O((N+M) log(N+M))、空間 O(N+M)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    vector<vector<pair<int, long long>>> adj(n + 1);
    while (m--) {
        int u, v; long long w; cin >> u >> v >> w;
        adj[u].push_back({v, w}); adj[v].push_back({u, w});
    }
    const long long INF = 1LL << 62;
    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long, int>, vector<pair<long long, int>>,
                   greater<pair<long long, int>>> pq;
    dist[1] = 0; pq.push({0, 1});
    while (!pq.empty()) {
        long long d = pq.top().first;
        int u = pq.top().second;
        pq.pop();
        if (d != dist[u]) continue;
        for (int i = 0; i < (int)adj[u].size(); ++i) {
            int v = adj[u][i].first;
            long long w = adj[u][i].second;
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }
    cout << (dist[n] == INF ? -1 : dist[n]) << '\n';
}
```

## a031. 最長遞增子序列

[原題](https://oj.itousouta.me/problems/a031)｜`tails[len-1]` 保存長度 len 的嚴格遞增子序列中最小的末項。用二分搜尋找出第一個大於等於目前值的位置，重複值不會增加長度。時間 O(n log n)、空間 O(n)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    int tails[100000], length = 0;
    for (int i = 0; i < n; ++i) {
        int x; cin >> x;
        int left = 0, right = length;
        while (left < right) {
            int mid = (left + right) / 2;
            if (tails[mid] < x) left = mid + 1;
            else right = mid;
        }
        tails[left] = x;
        if (left == length) ++length;
    }
    cout << length << '\n';
}
```

## a032. 最常見字元

[原題](https://oj.itousouta.me/problems/a032)｜計數後從 `a` 掃到 `z`，只在次數**嚴格較大**時更新，自然選到並列時字典序最小者。時間 O(n+26)、空間 O(26)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; cin >> s;
    int count[26] = {}, best = 0;
    for (int i = 0; i < (int)s.size(); ++i) ++count[s[i] - 'a'];
    for (int i = 1; i < 26; ++i)
        if (count[i] > count[best]) best = i;
    cout << char('a' + best) << ' ' << count[best] << '\n';
}
```

## a033. 畢業紀念冊之外的用途？

[原題](https://oj.itousouta.me/problems/a033)｜每筆資料都讀入，`owner` 不參與判斷；只要 `purpose != 1` 就計數。時間 O(n)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n, owner, purpose, count = 0; cin >> n;
    while (n--) { cin >> owner >> purpose; count += purpose != 1; }
    cout << count << '\n';
}
```

## a034. 校長何意味？

[原題](https://oj.itousouta.me/problems/a034)｜逐屆統計 26 個字母，挑出最高次數（並列選字母較小）；只保留最高次數至少 2 的屆別，按屆別排序後印出。時間 O(總字數 + N²)、空間 O(N)。

```cpp
#include <bits/stdc++.h>
using namespace std;
struct Record { int year; char letter; int times; };
int main() {
    int n; cin >> n;
    Record result[1000];
    int used = 0;
    for (int j = 0; j < n; ++j) {
        int year; string slogan; cin >> year >> slogan;
        int count[26] = {}, best = 0;
        for (int i = 0; i < (int)slogan.size(); ++i)
            ++count[slogan[i] - 'A'];
        for (int i = 1; i < 26; ++i)
            if (count[i] > count[best]) best = i;
        if (count[best] >= 2) {
            result[used].year = year;
            result[used].letter = char('A' + best);
            result[used].times = count[best];
            ++used;
        }
    }
    for (int i = 0; i < used; ++i)
        for (int j = i + 1; j < used; ++j)
            if (result[j].year < result[i].year) swap(result[i], result[j]);
    cout << used << '\n';
    for (int i = 0; i < used; ++i)
        cout << result[i].year << ' ' << result[i].letter << ' '
             << result[i].times << '\n';
}
```

## a035. 戶政事務所的四則運算

[原題](https://oj.itousouta.me/problems/a035)｜輸入順序是**運算子、N、M**，乘積可能超過 32 位元。題目保證除法可整除且除數不為零。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    char op; long long n, m; cin >> op >> n >> m;
    if (op == '+') cout << n + m;
    else if (op == '-') cout << n - m;
    else if (op == '*') cout << n * m;
    else cout << n / m;
    cout << '\n';
}
```

## a036. 我愛國文！

[原題](https://oj.itousouta.me/problems/a036)｜成績大於**或等於**標準才輸出 `Safe!`，否則印出全形驚嘆號。時間 O(Q)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int q, limit, score; cin >> q >> limit;
    while (q--) {
        cin >> score;
        cout << (score >= limit ? "Safe!" : "我愛國文！") << '\n';
    }
}
```

## a037. 搶票機器人

[原題](https://oj.itousouta.me/problems/a037)｜先建立 N×M 的零矩陣，座標從 **0** 開始，重複紀錄仍設為 1。時間 O(NM+Q)、空間 O(NM)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int seats[1000][1000];
int main() {
    int q, n, m; cin >> q >> n >> m;
    while (q--) { int u, v; cin >> u >> v; seats[u][v] = 1; }
    for (int i = 0; i < n; ++i) {
        for (int c = 0; c < m; ++c)
            cout << (c ? " " : "") << seats[i][c];
        cout << '\n';
    }
}
```

## a038. 戰犯是誰

[原題](https://oj.itousouta.me/problems/a038)｜背號只有 1～20，直接用陣列統計；由小到大掃描且只接受更大次數。時間 O(N+20)、空間 O(20)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n, count[21] = {}, best = 1; cin >> n;
    while (n--) { int x; cin >> x; ++count[x]; }
    for (int i = 2; i <= 20; ++i)
        if (count[i] > count[best]) best = i;
    cout << best << '\n';
}
```

## a039. 能量分段計畫

[原題](https://oj.itousouta.me/problems/a039)｜設前綴和 P，`dp[j][i]` 表示前 i 站切成 j 段的最小平方和，轉移為 `min(dp[j-1][t]+(P[i]-P[t])²)`（`j-1 ≤ t < i`）。因為能量值非負，最佳切點隨 i 單調，可用分治最佳化計算每層 DP。時間 O(KN log N)、空間 O(N)。

```cpp
#include <bits/stdc++.h>
using namespace std;
long long p[501], prevDp[501], curDp[501];
int parts;
void solve(int left, int right, int optLeft, int optRight) {
    if (left > right) return;
    int mid = (left + right) / 2, best = -1;
    for (int t = max(parts - 1, optLeft); t <= min(mid - 1, optRight); ++t) {
        if (prevDp[t] == (1LL << 62)) continue;
        long long diff = p[mid] - p[t];
        long long value = prevDp[t] + diff * diff;
        if (value < curDp[mid]) { curDp[mid] = value; best = t; }
    }
    solve(left, mid - 1, optLeft, best);
    solve(mid + 1, right, best, optRight);
}
int main() {
    int n, k; cin >> n >> k;
    for (int i = 1, x; i <= n; ++i) { cin >> x; p[i] = p[i - 1] + x; }
    const long long INF = 1LL << 62;
    for (int i = 1; i <= n; ++i) prevDp[i] = INF;
    for (parts = 1; parts <= k; ++parts) {
        for (int i = 0; i <= n; ++i) curDp[i] = INF;
        solve(parts, n, parts - 1, n - 1);
        for (int i = 0; i <= n; ++i) prevDp[i] = curDp[i];
    }
    cout << prevDp[n] << '\n';
}
```

## a040. 喵們想吃飯

[原題](https://oj.itousouta.me/problems/a040)｜通道是堆疊。想輸出的貓若不在頂端，就按 1、2、… 的順序繼續入棧，直到能彈出或再也無法入棧。每組時間 O(N)、空間 O(N)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n, next = 1, top = 0; cin >> n;
        int st[100000];
        bool ok = true;
        for (int i = 0, want; i < n; ++i) {
            cin >> want;
            while (next <= n && (top == 0 || st[top - 1] != want))
                st[top++] = next++;
            if (top > 0 && st[top - 1] == want) --top;
            else ok = false;
        }
        cout << (ok ? "Yes" : "No") << '\n';
    }
}
```

## a041. 中電會最後的訊息

[原題](https://oj.itousouta.me/problems/a041)｜遇到零就延長目前連續段，遇到非零則歸零。時間 O(N)、空間 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, streak = 0, best = 0; cin >> n;
    while (n--) {
        int x; cin >> x;
        streak = (x == 0 ? streak + 1 : 0);
        best = max(best, streak);
    }
    cout << best << '\n';
}
```

## a042. 整除區間

[原題](https://oj.itousouta.me/problems/a042)｜從 1 到 X 的 K 倍數有 `X/K` 個，答案是 `R/K-(L-1)/K`。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    long long l, r, k; cin >> l >> r >> k;
    cout << r / k - (l - 1) / k << '\n';
}
```

## a043. 最長上升路段

[原題](https://oj.itousouta.me/problems/a043)｜只有目前值**嚴格大於**前一值才延長；否則從當前位置重新開始。只在找到更長路段時更新，便保留最早起點。時間 O(N)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n, prev, start = 1, bestLen = 1, bestStart = 1;
    cin >> n >> prev;
    for (int i = 2, x; i <= n; ++i) {
        cin >> x;
        if (x <= prev) start = i;
        int length = i - start + 1;
        if (length > bestLen) { bestLen = length; bestStart = start; }
        prev = x;
    }
    cout << bestLen << ' ' << bestStart << ' ' << bestStart + bestLen - 1 << '\n';
}
```

## a044. 迷宮最短路

[原題](https://oj.itousouta.me/problems/a044)｜每步等長，用 BFS，第一次到達終點就是最短步數。時間、空間 O(HW)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h, w; cin >> h >> w;
    string g[200]; queue<pair<int, int>> q;
    int dist[200][200];
    for (int r = 0; r < h; ++r) {
        cin >> g[r];
        for (int c = 0; c < w; ++c) {
            dist[r][c] = -1;
            if (g[r][c] == 'S') { q.push({r, c}); dist[r][c] = 0; }
        }
    }
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    while (!q.empty()) {
        int r = q.front().first, c = q.front().second;
        q.pop();
        if (g[r][c] == 'T') { cout << dist[r][c] << '\n'; return 0; }
        for (int d = 0; d < 4; ++d) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= h || nc < 0 || nc >= w ||
                g[nr][nc] == '#' || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;
            q.push({nr, nc});
        }
    }
    cout << -1 << '\n';
}
```

## a045. 區間總和查詢

[原題](https://oj.itousouta.me/problems/a045)｜前綴和 `P[i]` 是前 i 個數的總和，閉區間 `[L,R]` 答案為 `P[R]-P[L-1]`。使用 64 位元。時間 O(N+Q)、空間 O(N)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    long long p[200001] = {};
    for (int i = 1; i <= n; ++i) {
        long long x; cin >> x; p[i] = p[i - 1] + x;
    }
    while (q--) { int l, r; cin >> l >> r; cout << p[r] - p[l - 1] << '\n'; }
}
```

## a046. 喵靈的午睡鬧鐘

[原題](https://oj.itousouta.me/problems/a046)｜換算為一天內的分鐘數，再對 1440 取餘數處理跨日。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    long long h, m, d; cin >> h >> m >> d;
    long long now = (h * 60 + m + d) % 1440;
    cout << now / 60 << ' ' << now % 60 << '\n';
}
```

## a047. 喵靈想釣魚

[原題](https://oj.itousouta.me/problems/a047)｜先判斷下雨，再依溫度選擇；18 和 30 都屬 `FISH`。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int t, rain; cin >> t >> rain;
    if (rain) cout << "STAY\n";
    else if (t < 18) cout << "COLD\n";
    else if (t > 30) cout << "HOT\n";
    else cout << "FISH\n";
}
```

## a048. 喵靈的神奇水壺

[原題](https://oj.itousouta.me/problems/a048)｜**先**判斷是否不足而補滿，**再**扣掉本次飲水量。喝 0 毫升不會觸發補水。時間 O(N)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n, capacity, water, refills = 0; cin >> n >> capacity >> water;
    while (n--) {
        int drink; cin >> drink;
        if (water < drink) { water = capacity; ++refills; }
        water -= drink;
    }
    cout << refills << ' ' << water << '\n';
}
```

## a049. 喵靈的小魚乾

[原題](https://oj.itousouta.me/problems/a049)｜點心日是 `K, 2K, …, qK`，其中 `q=N/K`，用等差級數求和。時間、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    long long n, k; cin >> n >> k;
    long long q = n / k;
    cout << k * q * (q + 1) / 2 << '\n';
}
```

## a050. 喵靈的小魔術

[原題](https://oj.itousouta.me/problems/a050)｜只追蹤球所在位置；交換若不含此位置，球就不動。時間 O(N)、空間 O(1)。

```cpp
#include <iostream>
using namespace std;
int main() {
    int n, ball; cin >> n >> ball;
    while (n--) {
        int a, b; cin >> a >> b;
        if (ball == a) ball = b;
        else if (ball == b) ball = a;
    }
    cout << ball << '\n';
}
```

## a051. 括號深度檢查

[原題](https://oj.itousouta.me/problems/a051)｜以堆疊驗證括號種類和關閉順序，壓入左括號後更新最大深度。時間 O(n)、空間 O(n)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, st; cin >> s;
    int depth = 0;
    for (int i = 0; i < (int)s.size(); ++i) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            st += c; depth = max(depth, (int)st.size());
        } else {
            char want = c == ')' ? '(' : c == ']' ? '[' : '{';
            if (st.empty() || st.back() != want) {
                cout << "NO\n"; return 0;
            }
            st.pop_back();
        }
    }
    if (st.empty()) cout << "YES " << depth << '\n';
    else cout << "NO\n";
}
```

## a052. 一次性訊號站

[原題](https://oj.itousouta.me/problems/a052)｜所有格子在同一秒**同時**更新，所以每回合以舊矩陣計算新矩陣，再整體交換；2 下一秒變 0，只有 1 能受鄰近 2 影響。時間 O(TMN)、空間 O(MN)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int a[100][100], nextState[100][100];
int main() {
    int m, n, t; cin >> m >> n >> t;
    for (int y = 0; y < m; ++y)
        for (int x = 0; x < n; ++x) cin >> a[y][x];
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};
    for (int second = 0; second < t; ++second) {
        for (int r = 0; r < m; ++r) for (int c = 0; c < n; ++c) {
            nextState[r][c] = a[r][c];
            if (a[r][c] == 2) nextState[r][c] = 0;
            if (a[r][c] != 1) continue;
            for (int d = 0; d < 4; ++d) {
                int y = r + dr[d], x = c + dc[d];
                if (y >= 0 && y < m && x >= 0 && x < n && a[y][x] == 2)
                    nextState[r][c] = 2;
            }
        }
        for (int r = 0; r < m; ++r)
            for (int c = 0; c < n; ++c) a[r][c] = nextState[r][c];
    }
    for (int r = 0; r < m; ++r) {
        for (int c = 0; c < n; ++c) cout << (c ? " " : "") << a[r][c];
        cout << '\n';
    }
}
```

## a053. 校園悠遊卡異常交易分析

[原題](https://oj.itousouta.me/problems/a053)｜先驗證前 14 位加權和與最後一位檢查碼，再以「店家＋分類＋金額」建立字串鍵；流水號和保留碼不在分組鍵內。排序後同鍵的紀錄會相鄰，逐組計數並選出次數最高的店家；平手選較小的三位店家碼。時間 O(15N log N)、空間 O(N)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    string groups[10000];
    int used = 0;
    while (n--) {
        string s; cin >> s;
        int sum = 0;
        for (int i = 0; i < 14; ++i)
            sum += (i % 2 ? 3 : 1) * (s[i] - '0');
        if ((sum + s[14] - '0') % 10 != 0) continue;
        groups[used++] = s.substr(0, 3) + s.substr(3, 3) + s.substr(10, 3);
    }
    if (used == 0) { cout << "invalid\n"; return 0; }
    sort(groups, groups + used);
    string winner = "999";
    int best = 0;
    for (int i = 0; i < used;) {
        int end = i + 1;
        while (end < used && groups[end] == groups[i]) ++end;
        string shop = groups[i].substr(0, 3);
        if (end - i > best || (end - i == best && shop < winner)) {
            winner = shop;
            best = end - i;
        }
        i = end;
    }
    cout << winner << ' ' << best << '\n';
}
```

## a054. 資料卡片還原

[原題](https://oj.itousouta.me/problems/a054)｜一次操作等於按欄（`i%k`）和列（`i/k`）讀取。復原時**倒序**處理操作，逐欄列舉原字串的索引，按目前字串的順序將字元放回索引。時間 O(nm)、空間 O(n+m)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m; cin >> n >> m;
    int k[100]; for (int i = 0; i < m; ++i) cin >> k[i];
    string s; cin >> s;
    for (int turn = m - 1; turn >= 0; --turn) {
        string original(n, '?');
        int pos = 0;
        for (int col = 0; col < k[turn]; ++col)
            for (int i = col; i < n; i += k[turn])
                original[i] = s[pos++];
        s = original;
    }
    cout << s << '\n';
}
```

## a055. Candy Crushhhhhhh

[原題](https://oj.itousouta.me/problems/a055)｜每輪先把所有橫向與直向長度至少 3 的非零連線標記；統一消除後，各欄從下往上壓緊。沒有連線就不計入輪數。每輪 O(RC)，空間 O(RC)；每輪至少消除三顆，總時間 O((RC)²)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    int a[50][50];
    for (int i = 0; i < r; ++i)
        for (int j = 0; j < c; ++j) cin >> a[i][j];
    int rounds = 0, total = 0;
    while (true) {
        bool mark[50][50] = {};
        for (int i = 0; i < r; ++i)
            for (int j = 0, end; j < c; j = end) {
                end = j + 1;
                while (end < c && a[i][end] == a[i][j]) ++end;
                if (a[i][j] && end - j >= 3)
                    for (int x = j; x < end; ++x) mark[i][x] = true;
            }
        for (int j = 0; j < c; ++j)
            for (int i = 0, end; i < r; i = end) {
                end = i + 1;
                while (end < r && a[end][j] == a[i][j]) ++end;
                if (a[i][j] && end - i >= 3)
                    for (int y = i; y < end; ++y) mark[y][j] = true;
            }
        int removed = 0;
        for (int i = 0; i < r; ++i) for (int j = 0; j < c; ++j)
            if (mark[i][j]) { a[i][j] = 0; ++removed; }
        if (!removed) break;
        ++rounds; total += removed;
        for (int j = 0; j < c; ++j) {
            int dest = r - 1;
            for (int i = r - 1; i >= 0; --i)
                if (a[i][j]) a[dest--][j] = a[i][j];
            while (dest >= 0) a[dest--][j] = 0;
        }
    }
    cout << rounds << ' ' << total << '\n';
    for (int i = 0; i < r; ++i) {
        for (int j = 0; j < c; ++j) cout << (j ? " " : "") << a[i][j];
        cout << '\n';
    }
}
```

## a056. Candy Crush 進階版

[原題](https://oj.itousouta.me/problems/a056)｜交換非空相鄰格後，若無連線立即換回；有效交換才依序「同時標記、消除、垂直掉落、按欄從左到右且從下到上補糖」。每次交換的連鎖分數從第一輪重新計算；糖果用盡可留下 0。若盤面大小 P=RC，總時間上界 O(QP(P+N))、空間 O(P+N)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int r, c, board[20][20], refill[3000];
bool mark[20][20];
int findMatches() {
    for (int i = 0; i < r; ++i)
        for (int j = 0; j < c; ++j) mark[i][j] = false;
    for (int i = 0; i < r; ++i)
        for (int j = 0, end; j < c; j = end) {
            end = j + 1;
            while (end < c && board[i][end] == board[i][j]) ++end;
            if (board[i][j] != 0 && end - j >= 3)
                for (int x = j; x < end; ++x) mark[i][x] = true;
        }
    for (int j = 0; j < c; ++j)
        for (int i = 0, end; i < r; i = end) {
            end = i + 1;
            while (end < r && board[end][j] == board[i][j]) ++end;
            if (board[i][j] != 0 && end - i >= 3)
                for (int y = i; y < end; ++y) mark[y][j] = true;
        }
    int count = 0;
    for (int i = 0; i < r; ++i)
        for (int j = 0; j < c; ++j) if (mark[i][j]) ++count;
    return count;
}
int main() {
    int q, n; cin >> r >> c >> q >> n;
    for (int i = 0; i < r; ++i)
        for (int j = 0; j < c; ++j) cin >> board[i][j];
    for (int i = 0; i < n; ++i) cin >> refill[i];
    int used = 0, valid = 0, removedTotal = 0, points = 0;
    for (int operation = 0; operation < q; ++operation) {
        int y1, x1, y2, x2; cin >> y1 >> x1 >> y2 >> x2;
        --y1; --x1; --y2; --x2;
        if (!board[y1][x1] || !board[y2][x2]) continue;
        swap(board[y1][x1], board[y2][x2]);
        int matches = findMatches();
        if (!matches) { swap(board[y1][x1], board[y2][x2]); continue; }
        ++valid;
        int round = 0;
        while (matches > 0) {
            ++round; removedTotal += matches; points += round * matches;
            for (int i = 0; i < r; ++i) for (int j = 0; j < c; ++j)
                if (mark[i][j]) board[i][j] = 0;
            for (int j = 0; j < c; ++j) {
                int dest = r - 1;
                for (int i = r - 1; i >= 0; --i)
                    if (board[i][j]) board[dest--][j] = board[i][j];
                while (dest >= 0) board[dest--][j] = 0;
                for (int i = r - 1; i >= 0; --i)
                    if (!board[i][j] && used < n) board[i][j] = refill[used++];
            }
            matches = findMatches();
        }
    }
    cout << valid << ' ' << removedTotal << ' ' << points << '\n';
    for (int i = 0; i < r; ++i) {
        for (int j = 0; j < c; ++j) cout << (j ? " " : "") << board[i][j];
        cout << '\n';
    }
}
```

## a057. 跑馬燈換班

[原題](https://oj.itousouta.me/problems/a057)｜向左循環移動 k 次，只需取 `k % |s|`；第 i 個輸出字元是原來第 `(i+k)%|s|` 個字元。時間 O(|s|)、額外空間 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; long long k; cin >> s >> k;
    int shift = k % s.size();
    for (int i = 0; i < (int)s.size(); ++i)
        cout << s[(i + shift) % s.size()];
    cout << '\n';
}
```

## a058. 倒帶留言

[原題](https://oj.itousouta.me/problems/a058)｜依序找連續相同字元的區間，即使只出現一次也要輸出 `1`；長度超過 9 直接印完整數字。時間 O(n)、額外空間 O(1)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s; cin >> s;
    for (int i = 0; i < (int)s.size();) {
        int j = i + 1;
        while (j < (int)s.size() && s[j] == s[i]) ++j;
        cout << s[i] << j - i;
        i = j;
    }
    cout << '\n';
}
```

## a059. 鏡像相框

[原題](https://oj.itousouta.me/problems/a059)｜`H` 反轉**每一列的字元**；`V` 反轉**各列的順序**。時間 O(RC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c; char dir; cin >> r >> c >> dir;
    string grid[30];
    for (int i = 0; i < r; ++i) cin >> grid[i];
    if (dir == 'H') {
        for (int i = 0; i < r; ++i)
            for (int j = 0; j < c / 2; ++j)
                swap(grid[i][j], grid[i][c - 1 - j]);
    } else {
        for (int i = 0; i < r / 2; ++i) swap(grid[i], grid[r - 1 - i]);
    }
    for (int i = 0; i < r; ++i) cout << grid[i] << '\n';
}
```

## a060. 蛇形字幕牆

[原題](https://oj.itousouta.me/problems/a060)｜偶數列從左到右讀，奇數列反向讀，直接串接且不插入空白。時間 O(RC)、空間 O(C)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    for (int i = 0; i < r; ++i) {
        string row; cin >> row;
        if (i % 2 == 0) {
            for (int j = 0; j < c; ++j) cout << row[j];
        } else {
            for (int j = c - 1; j >= 0; --j) cout << row[j];
        }
    }
    cout << '\n';
}
```

## a061. 郵票座標

[原題](https://oj.itousouta.me/problems/a061)｜操作座標從 1 起算；`S` 可覆蓋成字母或 `.`，`G` 只查詢。時間 O(RC+Q)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c, q; cin >> r >> c;
    string a[50];
    for (int i = 0; i < r; ++i) cin >> a[i];
    cin >> q;
    for (int i = 0; i < q; ++i) {
        char op; int y, x; cin >> op >> y >> x; --y; --x;
        if (op == 'S') { char value; cin >> value; a[y][x] = value; }
        else cout << a[y][x] << '\n';
    }
}
```

## a062. 像素海岸線

[原題](https://oj.itousouta.me/problems/a062)｜對每個 `#` 的四條邊，另一側若出界或是 `.` 就算一條露出邊。時間 O(RC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    string a[100];
    for (int i = 0; i < r; ++i) cin >> a[i];
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1}, answer = 0;
    for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x) {
        if (a[y][x] != '#') continue;
        for (int d = 0; d < 4; ++d) {
            int ny = y + dr[d], nx = x + dc[d];
            if (ny < 0 || ny >= r || nx < 0 || nx >= c || a[ny][nx] == '.')
                ++answer;
        }
    }
    cout << answer << '\n';
}
```

## a063. 印章拼貼

[原題](https://oj.itousouta.me/problems/a063)｜依序處理蓋章；印章上的 `.` 透明，不改海報，字母則覆蓋既有內容。時間 O(RC+QHW)、空間 O(RC+HW)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c, h, w, q; cin >> r >> c;
    string poster[50];
    for (int i = 0; i < r; ++i) cin >> poster[i];
    cin >> h >> w;
    string stamp[50];
    for (int i = 0; i < h; ++i) cin >> stamp[i];
    cin >> q;
    for (int operation = 0; operation < q; ++operation) {
        int y, x; cin >> y >> x; --y; --x;
        for (int i = 0; i < h; ++i) for (int j = 0; j < w; ++j)
            if (stamp[i][j] != '.') poster[y + i][x + j] = stamp[i][j];
    }
    for (int i = 0; i < r; ++i) cout << poster[i] << '\n';
}
```

## a064. 招牌洗牌

[原題](https://oj.itousouta.me/problems/a064)｜每次只複製要移動的整列或整行，用原來的順序計算新位置；`k` 先對長度取餘數。時間 O(RC+Q(R+C))、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c, q; cin >> r >> c;
    string a[50];
    for (int i = 0; i < r; ++i) cin >> a[i];
    cin >> q;
    for (int operation = 0; operation < q; ++operation) {
        char op; int index; long long k; cin >> op >> index >> k;
        --index;
        if (op == 'R') {
            string old = a[index];
            for (int j = 0; j < c; ++j)
                a[index][(j + k % c) % c] = old[j];
        } else {
            string old;
            for (int i = 0; i < r; ++i) old += a[i][index];
            for (int i = 0; i < r; ++i)
                a[(i + k % r) % r][index] = old[i];
        }
    }
    for (int i = 0; i < r; ++i) cout << a[i] << '\n';
}
```

## a065. 八方向尋字

[原題](https://oj.itousouta.me/problems/a065)｜列舉每個起點和八個方向，逐字檢查是否仍在邊界內且相等。起點或方向不同都算不同答案。時間 O(8RCL)、空間 O(RC+L)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    string a[30];
    for (int i = 0; i < r; ++i) cin >> a[i];
    string word; cin >> word;
    int answer = 0;
    for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x)
        for (int dy = -1; dy <= 1; ++dy) for (int dx = -1; dx <= 1; ++dx) {
            if (!dy && !dx) continue;
            bool ok = true;
            for (int i = 0; i < (int)word.size(); ++i) {
                int ny = y + dy * i, nx = x + dx * i;
                if (ny < 0 || ny >= r || nx < 0 || nx >= c ||
                    a[ny][nx] != word[i]) { ok = false; break; }
            }
            answer += ok;
        }
    cout << answer << '\n';
}
```

## a066. 破損字幕修補

[原題](https://oj.itousouta.me/problems/a066)｜只能看**原圖**的上下左右，所以另存結果圖，不能邊改邊看。候選字母並列時選較小者；沒有原始字母鄰居就保留 `?`。時間 O(RC×26)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    string a[100], result[100];
    for (int i = 0; i < r; ++i) { cin >> a[i]; result[i] = a[i]; }
    int dy[] = {-1, 1, 0, 0}, dx[] = {0, 0, -1, 1};
    for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x) {
        if (a[y][x] != '?') continue;
        int count[26] = {}, best = 0;
        for (int d = 0; d < 4; ++d) {
            int ny = y + dy[d], nx = x + dx[d];
            if (ny >= 0 && ny < r && nx >= 0 && nx < c && a[ny][nx] != '?')
                ++count[a[ny][nx] - 'A'];
        }
        for (int i = 1; i < 26; ++i)
            if (count[i] > count[best]) best = i;
        if (count[best]) result[y][x] = char('A' + best);
    }
    for (int i = 0; i < r; ++i) cout << result[i] << '\n';
}
```

## a067. 編輯器選取框

[原題](https://oj.itousouta.me/problems/a067)｜預先對每個字母做二維前綴和；用四個角相加減回答包含邊界的矩形查詢。時間 O(26RC+Q)、空間 O(26RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int p[26][301][301];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int r, c; cin >> r >> c;
    string a[300];
    for (int i = 0; i < r; ++i) cin >> a[i];
    for (int letter = 0; letter < 26; ++letter)
        for (int y = 1; y <= r; ++y) for (int x = 1; x <= c; ++x)
            p[letter][y][x] = p[letter][y - 1][x] + p[letter][y][x - 1]
                - p[letter][y - 1][x - 1] + (a[y - 1][x - 1] == char('A' + letter));
    int q; cin >> q;
    for (int i = 0; i < q; ++i) {
        int y1, x1, y2, x2; char ch; cin >> y1 >> x1 >> y2 >> x2 >> ch;
        int letter = ch - 'A';
        cout << p[letter][y2][x2] - p[letter][y1 - 1][x2]
             - p[letter][y2][x1 - 1] + p[letter][y1 - 1][x1 - 1] << '\n';
    }
}
```

## a068. 廣播訊息迷宮

[原題](https://oj.itousouta.me/problems/a068)｜先依目前格子調整朝向，再用「位置＋調整後朝向」判斷是否繞圈；重複狀態**不收字**。時間 O(4RC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    string a[30];
    for (int i = 0; i < r; ++i) cin >> a[i];
    int y, x; char heading; cin >> y >> x >> heading; --y; --x;
    string dirs = "NESW", message;
    int dir = dirs.find(heading), dy[] = {-1, 0, 1, 0}, dx[] = {0, 1, 0, -1};
    bool seen[30][30][4] = {};
    while (y >= 0 && y < r && x >= 0 && x < c && a[y][x] != '#') {
        char ch = a[y][x];
        if (ch == 'U') dir = 0;
        if (ch == 'R') dir = 1;
        if (ch == 'D') dir = 2;
        if (ch == 'L') dir = 3;
        if (seen[y][x][dir]) break;
        seen[y][x][dir] = true;
        if (ch != 'U' && ch != 'R' && ch != 'D' && ch != 'L') message += ch;
        y += dy[dir]; x += dx[dir];
    }
    cout << (message.empty() ? "-" : message) << '\n';
}
```

## a069. 同步文字校對

[原題](https://oj.itousouta.me/problems/a069)｜列舉所有**至少重疊一格**的位移。按 `dy`、`dx` 升序檢查，只在得分嚴格變高時更新，就完成平手規則。時間 O((R₁+R₂)(C₁+C₂)R₂C₂)、空間 O(R₁C₁+R₂C₂)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h1, w1, h2, w2; cin >> h1 >> w1;
    string a[12];
    for (int i = 0; i < h1; ++i) cin >> a[i];
    cin >> h2 >> w2;
    string b[12];
    for (int i = 0; i < h2; ++i) cin >> b[i];
    int best = -1, by = 0, bx = 0;
    for (int dy = 1 - h2; dy < h1; ++dy) for (int dx = 1 - w2; dx < w1; ++dx) {
        int count = 0;
        for (int y = 0; y < h2; ++y) for (int x = 0; x < w2; ++x) {
            int ay = dy + y, ax = dx + x;
            if (ay >= 0 && ay < h1 && ax >= 0 && ax < w1 &&
                b[y][x] != '.' && a[ay][ax] == b[y][x]) ++count;
        }
        if (count > best) { best = count; by = dy; bx = dx; }
    }
    cout << best << ' ' << by << ' ' << bx << '\n';
}
```

## a070. 四向水印

[原題](https://oj.itousouta.me/problems/a070)｜產生 0°、90°、180°、270° 四種順時針旋轉；同一左上角只要有**任一**方向完全放入且吻合，就加一，不按方向重複計數。時間 O(4RC×HW)、空間 O(RC+HW)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c; cin >> r >> c;
    string poster[60];
    for (int i = 0; i < r; ++i) cin >> poster[i];
    int h[4], w[4]; cin >> h[0] >> w[0];
    string stamp[4][10];
    for (int i = 0; i < h[0]; ++i) cin >> stamp[0][i];
    for (int turn = 1; turn < 4; ++turn) {
        h[turn] = w[turn - 1];
        w[turn] = h[turn - 1];
        for (int y = 0; y < h[turn]; ++y)
            stamp[turn][y] = string(w[turn], '?');
        for (int y = 0; y < h[turn - 1]; ++y)
            for (int x = 0; x < w[turn - 1]; ++x)
                stamp[turn][x][h[turn - 1] - 1 - y] = stamp[turn - 1][y][x];
    }
    int answer = 0;
    for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x) {
        for (int turn = 0; turn < 4; ++turn) {
            if (y + h[turn] > r || x + w[turn] > c) continue;
            bool ok = true;
            for (int i = 0; i < h[turn] && ok; ++i)
                for (int j = 0; j < w[turn]; ++j)
                if (stamp[turn][i][j] != '?' &&
                    stamp[turn][i][j] != poster[y + i][x + j]) {
                    ok = false; break;
                }
            if (ok) { ++answer; break; }
        }
    }
    cout << answer << '\n';
}
```

## a071. 折紙密碼

[原題](https://oj.itousouta.me/problems/a071)｜每次只儲存目前的**正面**。摺來的半邊成為上層並鏡像排列；若上層為 `.` 才顯示下層。依指令次序反覆縮小紙張。時間 O(QRC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c, q; cin >> r >> c;
    string a[32];
    for (int i = 0; i < r; ++i) cin >> a[i];
    cin >> q;
    for (int operation = 0; operation < q; ++operation) {
        char dir; cin >> dir;
        string next[32];
        if (dir == 'D' || dir == 'U') {
            for (int y = 0; y < r / 2; ++y) {
                for (int x = 0; x < c; ++x) {
                    char base = dir == 'D' ? a[r / 2 + y][x] : a[y][x];
                    char top = dir == 'D' ? a[r / 2 - 1 - y][x] : a[r - 1 - y][x];
                    next[y] += top == '.' ? base : top;
                }
            }
            r /= 2;
        } else {
            for (int y = 0; y < r; ++y) {
                for (int x = 0; x < c / 2; ++x) {
                    char base = dir == 'R' ? a[y][c / 2 + x] : a[y][x];
                    char top = dir == 'R' ? a[y][c / 2 - 1 - x] : a[y][c - 1 - x];
                    next[y] += top == '.' ? base : top;
                }
            }
            c /= 2;
        }
        for (int i = 0; i < r; ++i) a[i] = next[i];
    }
    cout << r << ' ' << c << '\n';
    for (int i = 0; i < r; ++i) cout << a[i] << '\n';
}
```

## a072. 多區印刷計分

[原題](https://oj.itousouta.me/problems/a072)｜矩形更新使用二維差分，在四個角加減 v；最後做二維前綴和還原全部分數，連沒更新過的格子也要比較。時間 O(Q+RC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
long long diff[402][402];
int main() {
    int r, c, q; cin >> r >> c >> q;
    while (q--) {
        int y1, x1, y2, x2; long long v;
        cin >> y1 >> x1 >> y2 >> x2 >> v;
        diff[y1][x1] += v; diff[y2 + 1][x1] -= v;
        diff[y1][x2 + 1] -= v; diff[y2 + 1][x2 + 1] += v;
    }
    long long best = LLONG_MIN, count = 0;
    for (int y = 1; y <= r; ++y) for (int x = 1; x <= c; ++x) {
        diff[y][x] += diff[y - 1][x] + diff[y][x - 1] - diff[y - 1][x - 1];
        if (diff[y][x] > best) { best = diff[y][x]; count = 1; }
        else if (diff[y][x] == best) ++count;
    }
    cout << best << ' ' << count << '\n';
}
```

## a073. 最大片字塊

[原題](https://oj.itousouta.me/problems/a073)｜`dp[y][x]` 是以此格為右下角、同字母實心正方形的最大邊長；只有左、上、左上三格都同字時，才能取三者最小值加一。平手依「字母、左上列、左上行」比較。時間 O(RC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int dp[301][301];
int main() {
    int r, c; cin >> r >> c;
    string a[300];
    for (int i = 0; i < r; ++i) cin >> a[i];
    int best = 0, by = 0, bx = 0; char letter = '-';
    for (int y = 1; y <= r; ++y) for (int x = 1; x <= c; ++x) {
        char ch = a[y - 1][x - 1];
        if (ch == '.') continue;
        int size = 1;
        if (y > 1 && x > 1 && a[y - 2][x - 1] == ch &&
            a[y - 1][x - 2] == ch && a[y - 2][x - 2] == ch)
            size += min(dp[y - 1][x], min(dp[y][x - 1], dp[y - 1][x - 1]));
        dp[y][x] = size;
        int top = y - size + 1, left = x - size + 1;
        if (size > best || (size == best &&
            (ch < letter || (ch == letter &&
            (top < by || (top == by && left < bx)))))) {
            best = size; letter = ch; by = top; bx = left;
        }
    }
    cout << best << ' ' << letter << ' ' << by << ' ' << bx << '\n';
}
```

## a074. 最短拼字路

[原題](https://oj.itousouta.me/problems/a074)｜BFS 的狀態是「座標、已輸入到第幾個字」。起點可免費選所有首字相符的格子；踏入新格時只有與**下一個**目標字相等才前進一個索引，其他格可路過。時間、空間 O(RC×|s|)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int dist[30][20][20], que[12000];
int main() {
    int r, c; cin >> r >> c;
    string a[20];
    for (int i = 0; i < r; ++i) cin >> a[i];
    string word; cin >> word;
    for (int i = 0; i < (int)word.size(); ++i)
        for (int y = 0; y < r; ++y)
            for (int x = 0; x < c; ++x) dist[i][y][x] = -1;
    int head = 0, tail = 0;
    for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x)
        if (a[y][x] == word[0]) {
            dist[0][y][x] = 0;
            que[tail++] = y * c + x;
        }
    int dy[] = {-1, 1, 0, 0}, dx[] = {0, 0, -1, 1};
    while (head < tail) {
        int state = que[head++];
        int index = state / (r * c);
        int y = (state / c) % r, x = state % c;
        if (index + 1 == (int)word.size()) {
            cout << dist[index][y][x] << '\n'; return 0;
        }
        for (int d = 0; d < 4; ++d) {
            int ny = y + dy[d], nx = x + dx[d];
            if (ny < 0 || ny >= r || nx < 0 || nx >= c || a[ny][nx] == '#') continue;
            int next = index + (a[ny][nx] == word[index + 1]);
            if (dist[next][ny][nx] != -1) continue;
            dist[next][ny][nx] = dist[index][y][x] + 1;
            que[tail++] = next * r * c + ny * c + nx;
        }
    }
    cout << -1 << '\n';
}
```

## a075. 暴雨與排水口

[原題](https://oj.itousouta.me/problems/a075)｜排水口只攔截**新雨**，不減少初始積水；每被雨淋一次只扣 1 容量，和雨量 d 無關。依序走訪降雨矩形中的每格，最後統計全圖。時間 O(MRC+K)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int water[100][100], drain[100][100];
int main() {
    int r, c, k, m; cin >> r >> c;
    for (int y = 0; y < r; ++y)
        for (int x = 0; x < c; ++x) cin >> water[y][x];
    cin >> k;
    for (int i = 0; i < k; ++i) {
        int y, x, capacity; cin >> y >> x >> capacity;
        drain[y][x] = capacity;
    }
    cin >> m;
    for (int i = 0; i < m; ++i) {
        int y1, x1, y2, x2, d; cin >> y1 >> x1 >> y2 >> x2 >> d;
        for (int y = y1; y <= y2; ++y)
            for (int x = x1; x <= x2; ++x) {
                if (drain[y][x] > 0) --drain[y][x];
                else water[y][x] += d;
            }
    }
    int lo = INT_MAX, hi = INT_MIN, left = 0;
    for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x) {
        if (water[y][x] < lo) lo = water[y][x];
        if (water[y][x] > hi) hi = water[y][x];
        left += drain[y][x];
    }
    cout << hi << ' ' << lo << ' ' << left << '\n';
}
```

## a076. 無人機巡邏

[原題](https://oj.itousouta.me/problems/a076)｜以 N、E、S、W 的循環索引處理轉向；`F k` 每次走一格，前方被擋就只結束**當次 F**。起點也要算已造訪。時間 O(RC+Q×max k)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
bool visited[100][100];
int main() {
    int r, c; cin >> r >> c;
    string grid[100];
    for (int i = 0; i < r; ++i) cin >> grid[i];
    int y, x, q; char heading; cin >> y >> x >> heading >> q;
    string directions = "NESW";
    int dir = 0;
    for (int i = 0; i < 4; ++i)
        if (directions[i] == heading) dir = i;
    int dy[] = {-1, 0, 1, 0}, dx[] = {0, 1, 0, -1};
    visited[y][x] = true;
    int count = 1;
    for (int i = 0; i < q; ++i) {
        char op; cin >> op;
        if (op == 'L') dir = (dir + 3) % 4;
        else if (op == 'R') dir = (dir + 1) % 4;
        else {
            int k; cin >> k;
            for (int step = 0; step < k; ++step) {
                int ny = y + dy[dir], nx = x + dx[dir];
                if (ny < 0 || ny >= r || nx < 0 || nx >= c || grid[ny][nx] == '#') break;
                y = ny; x = nx;
                if (!visited[y][x]) { visited[y][x] = true; ++count; }
            }
        }
    }
    cout << y << ' ' << x << ' ' << directions[dir] << ' ' << count << '\n';
}
```

## a077. 山火擴散

[原題](https://oj.itousouta.me/problems/a077)｜每回合從**舊地圖**找出正在燃燒的 `*`，將它們變成 `x`，並在新地圖點燃舊地圖中相鄰的 `.`。本回合新火不會再擴散。時間 O(TRC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int r, c, t; cin >> r >> c >> t;
    string grid[100];
    for (int i = 0; i < r; ++i) cin >> grid[i];
    int dy[] = {-1, 1, 0, 0}, dx[] = {0, 0, -1, 1};
    for (int turn = 0; turn < t; ++turn) {
        string next[100];
        for (int i = 0; i < r; ++i) next[i] = grid[i];
        for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x) {
            if (grid[y][x] != '*') continue;
            next[y][x] = 'x';
            for (int d = 0; d < 4; ++d) {
                int ny = y + dy[d], nx = x + dx[d];
                if (ny >= 0 && ny < r && nx >= 0 && nx < c && grid[ny][nx] == '.')
                    next[ny][nx] = '*';
            }
        }
        for (int i = 0; i < r; ++i) grid[i] = next[i];
    }
    int burned = 0, burning = 0;
    for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x) {
        if (grid[y][x] == 'x') ++burned;
        if (grid[y][x] == '*') ++burning;
    }
    cout << burned << ' ' << burning << '\n';
}
```

## a078. 錯位的照片

[原題](https://oj.itousouta.me/problems/a078)｜列舉九種位移，從 A 的 `(y,x)` 對應到 B 的 `(y+dr,x+dc)`，只計有重疊且像素相等的格子；同分依「移動距離、dr、dc」比較。時間 O(9RC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int a[200][200], b[200][200];
int main() {
    int r, c; cin >> r >> c;
    for (int y = 0; y < r; ++y)
        for (int x = 0; x < c; ++x) cin >> a[y][x];
    for (int y = 0; y < r; ++y)
        for (int x = 0; x < c; ++x) cin >> b[y][x];
    int best = -1, by = 0, bx = 0;
    for (int dy = -1; dy <= 1; ++dy) for (int dx = -1; dx <= 1; ++dx) {
        int count = 0;
        for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x) {
            int ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < r && nx >= 0 && nx < c && a[y][x] == b[ny][nx])
                ++count;
        }
        bool better = count > best;
        if (count == best) {
            int distance = abs(dy) + abs(dx), oldDistance = abs(by) + abs(bx);
            better = distance < oldDistance ||
                     (distance == oldDistance && (dy < by || (dy == by && dx < bx)));
        }
        if (better) { best = count; by = dy; bx = dx; }
    }
    cout << best << ' ' << by << ' ' << bx << '\n';
}
```

## a079. 照片局部修補

[原題](https://oj.itousouta.me/problems/a079)｜每次矩形修補都**立刻**把像素裁到 0～255，不能先合併變化量再裁；全部修補完才和 B 比較。時間 O(QRC+RC)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int photo[100][100];
int main() {
    int r, c, q; cin >> r >> c >> q;
    for (int y = 0; y < r; ++y)
        for (int x = 0; x < c; ++x) cin >> photo[y][x];
    for (int i = 0; i < q; ++i) {
        int y1, x1, y2, x2, d; cin >> y1 >> x1 >> y2 >> x2 >> d;
        for (int y = y1; y <= y2; ++y) for (int x = x1; x <= x2; ++x) {
            photo[y][x] += d;
            if (photo[y][x] < 0) photo[y][x] = 0;
            if (photo[y][x] > 255) photo[y][x] = 255;
        }
    }
    int equal = 0, difference = 0;
    for (int y = 0; y < r; ++y) for (int x = 0; x < c; ++x) {
        int value; cin >> value;
        if (photo[y][x] == value) ++equal;
        difference += abs(photo[y][x] - value);
    }
    cout << equal << ' ' << difference << '\n';
}
```

## a080. 捲動後的衛星圖

[原題](https://oj.itousouta.me/problems/a080)｜枚舉 R、C 各 N 種捲法，每種直接對照 B；先遍歷 R 再遍歷 C，k 從小到大，只有分數**嚴格增加**才更新，便可保留平手優先順序。時間 O(N³)、空間 O(N²)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int a[120][120], b[120][120];
int main() {
    int n; cin >> n;
    for (int y = 0; y < n; ++y)
        for (int x = 0; x < n; ++x) cin >> a[y][x];
    for (int y = 0; y < n; ++y)
        for (int x = 0; x < n; ++x) cin >> b[y][x];
    int best = -1, shift = 0; char way = 'R';
    for (int type = 0; type < 2; ++type) for (int k = 0; k < n; ++k) {
        int score = 0;
        for (int y = 0; y < n; ++y) for (int x = 0; x < n; ++x) {
            int ny = type == 0 ? (y + k) % n : y;
            int nx = type == 1 ? (x + k) % n : x;
            if (a[y][x] == b[ny][nx]) ++score;
        }
        if (score > best) { best = score; way = type == 0 ? 'R' : 'C'; shift = k; }
    }
    cout << best << ' ' << way << ' ' << shift << '\n';
}
```

## a081. 環形燈帶計分

[原題](https://oj.itousouta.me/problems/a081)｜維護每條燈帶的累積右移量（負值先模回 0～n-1）；對每回合、每個位置統計 26 個字母出現次數，取最大值加總。時間 O(kmn+26kn)、空間 O(mn)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main() {
    int m, n, k; cin >> m >> n >> k;
    string bands[30];
    int shift[30] = {};
    for (int i = 0; i < m; ++i) cin >> bands[i];
    long long total = 0;
    for (int turn = 0; turn < k; ++turn) {
        for (int i = 0; i < m; ++i) {
            int d; cin >> d;
            shift[i] = ((shift[i] + d) % n + n) % n;
        }
        for (int pos = 0; pos < n; ++pos) {
            int count[26] = {}, best = 0;
            for (int i = 0; i < m; ++i) {
                int letter = bands[i][(pos - shift[i] + n) % n] - 'a';
                ++count[letter];
                if (count[letter] > best) best = count[letter];
            }
            total += best;
        }
    }
    cout << total << '\n';
}
```

## a082. 彗星撞擊

[原題](https://oj.itousouta.me/problems/a082)｜同一格可能有多隻清醒恐龍，用整數計數而非布林值。每次先掃影響區域：若找到清醒恐龍，讓範圍內所有清醒恐龍暈眩，**不降低任何高度**；否則全範圍高度減 d。時間 O(M×min(R,S)×min(C,S)+K)、空間 O(RC)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int ground[100][100], awake[100][100];
int main() {
    int r, c, height, k, m; cin >> r >> c >> height;
    for (int y = 0; y < r; ++y)
        for (int x = 0; x < c; ++x) ground[y][x] = height;
    cin >> k;
    for (int i = 0; i < k; ++i) {
        int y, x; cin >> y >> x; ++awake[y][x];
    }
    cin >> m;
    for (int operation = 0; operation < m; ++operation) {
        int y, x, side, depth; cin >> y >> x >> side >> depth;
        int t = side / 2;
        int y1 = max(0, y - t), y2 = min(r - 1, y + t);
        int x1 = max(0, x - t), x2 = min(c - 1, x + t);
        bool hasAwake = false;
        for (int i = y1; i <= y2; ++i)
            for (int j = x1; j <= x2; ++j)
                if (awake[i][j] > 0) hasAwake = true;
        for (int i = y1; i <= y2; ++i) for (int j = x1; j <= x2; ++j) {
            if (hasAwake) awake[i][j] = 0;
            else ground[i][j] -= depth;
        }
    }
    int hi = INT_MIN, lo = INT_MAX, left = 0;
    for (int i = 0; i < r; ++i) for (int j = 0; j < c; ++j) {
        if (ground[i][j] > hi) hi = ground[i][j];
        if (ground[i][j] < lo) lo = ground[i][j];
        left += awake[i][j];
    }
    cout << hi << ' ' << lo << ' ' << left << '\n';
}
```

## a083. 1. 踩地雷（的反向版）

[原題](https://oj.itousouta.me/problems/a083)｜逐格撤銷轉換：第一列或最後一列先減 1；搜尋中心再除以 2。兩張 n×m 整數矩陣按相同位置對應。時間 O(nm)、空間 O(nm)。

```cpp
#include <iostream>
using namespace std;
int result[1000][1000];
int main() {
    int n, m; cin >> n >> m;
    for (int y = 0; y < n; ++y)
        for (int x = 0; x < m; ++x) cin >> result[y][x];
    for (int y = 0; y < n; ++y) for (int x = 0; x < m; ++x) {
        int center; cin >> center;
        if (y == 0 || y == n - 1) --result[y][x];
        if (center == 1) result[y][x] /= 2;
    }
    for (int y = 0; y < n; ++y) {
        for (int x = 0; x < m; ++x) {
            if (x > 0) cout << ' ';
            cout << result[y][x];
        }
        cout << '\n';
    }
}
```

## a084. 2. 猜字遊戲

[原題](https://oj.itousouta.me/problems/a084)｜先用原字母表驗證每個候選字：不能出界，重疊字母必須相同；合法才填入。顯示時保留各字首尾的字母、內部以 `_` 呈現，未填格為 `*`。本解將 `(x,y)` 解讀為從 **0** 開始的「列、行」，交叉點只要是任一字的端點就保留字母；原題沒有明說座標基底與交叉端點規則，提交前可先比對判題端資料。時間 O(rc+總字長)、空間 O(rc)。

```cpp
#include <bits/stdc++.h>
using namespace std;
char letters[200][200];
bool endpoint[200][200];
int main() {
    int r, c, n; cin >> r >> c >> n;
    for (int y = 0; y < r; ++y)
        for (int x = 0; x < c; ++x) letters[y][x] = '*';
    for (int operation = 0; operation < n; ++operation) {
        int row, col, dir; string word; cin >> row >> col >> dir >> word;
        int dy = dir == 1, dx = dir == 0;
        bool ok = true;
        for (int i = 0; i < (int)word.size(); ++i) {
            int y = row + i * dy, x = col + i * dx;
            if (y < 0 || y >= r || x < 0 || x >= c) { ok = false; break; }
            if (letters[y][x] != '*' && letters[y][x] != word[i]) {
                ok = false; break;
            }
        }
        if (!ok) continue;
        for (int i = 0; i < (int)word.size(); ++i) {
            int y = row + i * dy, x = col + i * dx;
            letters[y][x] = word[i];
            if (i == 0 || i + 1 == (int)word.size()) endpoint[y][x] = true;
        }
    }
    for (int y = 0; y < r; ++y) {
        for (int x = 0; x < c; ++x) {
            if (letters[y][x] == '*' || endpoint[y][x]) cout << letters[y][x];
            else cout << '_';
        }
        cout << '\n';
    }
}
```

## a085. 3. 運動比賽

[原題](https://oj.itousouta.me/problems/a085)｜每位選手的 3k 個數字按「逐日走、跑、騎」讀入。每天先計運動積分，再依當天最高／最低給總積分加減分，第二天起和本人前一天相比給 f；最後選總分最高者。本解把不滿 10 分鐘的部分捨去、最高及最低**並列者均適用**加扣分，總分並列時取編號最小者；原題尚未明定並列和未滿 10 分鐘的處理方式。時間 O(nk)、空間 O(nk)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int day[1000][1000];
long long total[1000];
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k, a, b, c, d, e, f;
    cin >> n >> k >> a >> b >> c >> d >> e >> f;
    for (int i = 0; i < n; ++i) for (int j = 0; j < k; ++j) {
        int walk, run, bike; cin >> walk >> run >> bike;
        day[i][j] = walk / 10 * a + run / 10 * b + bike / 10 * c;
    }
    for (int j = 0; j < k; ++j) {
        int hi = INT_MIN, lo = INT_MAX;
        for (int i = 0; i < n; ++i) {
            if (day[i][j] > hi) hi = day[i][j];
            if (day[i][j] < lo) lo = day[i][j];
        }
        for (int i = 0; i < n; ++i) {
            total[i] += day[i][j];
            if (day[i][j] == hi) total[i] += d;
            if (day[i][j] == lo) total[i] -= e;
            if (j > 0 && day[i][j] > day[i][j - 1]) total[i] += f;
        }
    }
    int winner = 0;
    for (int i = 1; i < n; ++i)
        if (total[i] > total[winner]) winner = i;
    cout << winner + 1 << ' ' << total[winner] << '\n';
}
```
