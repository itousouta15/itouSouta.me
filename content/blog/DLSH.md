---
title: 校內資訊學科能力競賽 題目及題解
date: 2026-10-26
description: 整理 115 年校內資訊學科能力競賽的題目及題解
categories:
  - 程式競賽
tags:
  - 題解
  - 競賽
cover: /assets/blog/dlsh.webp
pinned: false
legacyPath: /2026/10/26/DLSH
---
## 1. 手遊廣告

### 題意與格式

角色初始戰力為 $A$，依序遇到 $M$ 隻戰力為 $T_i$ 的怪物。只有**目前戰力嚴格大於**怪物戰力，才能擊敗牠，並增加 $T_i$ 戰力；否則立刻停止。求最後戰力。

輸入第一行為 $M,A$，第二行依遭遇順序列出 $M$ 個 $T_i$；輸出一個整數。$1\le M\le300$、$1\le A\le10000$、$1\le T_i\le6000$。

```text
輸入
4 6
2 7 20 1

輸出
15
```

先打贏戰力 2 和 7 的怪物，戰力變成 15；碰到戰力 20 的怪物就停止，最後那隻不再挑戰。

### 解法

按順序讀入怪物。若已停止，只讀掉剩餘輸入；否則檢查 `power > monster`，成功才加上怪物戰力。這個不變量保證處理完前 $i$ 隻怪物時，`power` 恰好是角色當下的戰力。

時間 $O(M)$，額外空間 $O(1)$。

```cpp
#include <iostream>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int M, power;
    cin >> M >> power;
    bool stopped = false;
    for (int i = 0; i < M; ++i) {
        int monster;
        cin >> monster;
        if (!stopped) {
            if (power > monster)
                power += monster;
            else
                stopped = true;
        }
    }
    cout << power << '\n';
}
```

## 2. 積水與排水口

### 題意與格式

有一張 $R\times C$ 的積水地圖，少數格子有排水口。每場雨給定**零起算、包含邊界**的矩形 $(r_1,c_1)$ 到 $(r_2,c_2)$，以及雨量 $d$。範圍內每格獨立處理：若排水口剩餘容量大於零，容量減一，積水**維持原樣**；否則積水增加 $d$。容量消耗的是一次降雨，不是 $d$ 單位水量。

輸入先給 $R,C$、$R$ 行初始積水，接著給 $K$ 筆 `r c capacity`，最後給 $M$ 筆 `r1 c1 r2 c2 d`。輸出整張地圖的最大積水、最小積水、剩餘排水容量總和。限制為 $R,C\le100$、$M\le100$、$K\le RC$；$K=0$ 時沒有排水口資料行。

例如：

```text
輸入
2 3
2 1 3
0 4 2
2
0 1 1
1 1 2
3
0 0 1 2 2
1 1 1 1 3
0 1 0 1 1

輸出
5 2 0
```

### 解法

直接用兩張二維陣列記錄積水與剩餘容量。每場雨遍歷指定矩形，容量大於零便減一，否則加上 $d$。全部處理完後，再遍歷**所有**格子統計答案，連沒被雨淋過的格子也要算進最大、最小值。

關鍵是不要把有排水口的格子清零：初始積水、先前累積的積水都不會被抽走。每場雨對每格的操作恰好對應題目的兩種情況，因此依降雨順序處理後，兩張陣列就是正確的最終狀態。

時間 $O(MRC+K)$，空間 $O(RC)$。

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int R, C;
    cin >> R >> C;
    vector<vector<int>> water(R, vector<int>(C));
    vector<vector<int>> capacity(R, vector<int>(C, 0));
    for (int r = 0; r < R; ++r)
        for (int c = 0; c < C; ++c)
            cin >> water[r][c];

    int K;
    cin >> K;
    for (int i = 0; i < K; ++i) {
        int r, c, cap;
        cin >> r >> c >> cap;
        capacity[r][c] = cap;
    }

    int M;
    cin >> M;
    for (int i = 0; i < M; ++i) {
        int r1, c1, r2, c2, d;
        cin >> r1 >> c1 >> r2 >> c2 >> d;
        for (int r = r1; r <= r2; ++r) {
            for (int c = c1; c <= c2; ++c) {
                if (capacity[r][c] > 0)
                    --capacity[r][c];
                else
                    water[r][c] += d;
            }
        }
    }

    int maximum = 0, minimum = water[0][0], remaining = 0;
    for (int r = 0; r < R; ++r) {
        for (int c = 0; c < C; ++c) {
            maximum = max(maximum, water[r][c]);
            minimum = min(minimum, water[r][c]);
            remaining += capacity[r][c];
        }
    }
    cout << maximum << ' ' << minimum << ' ' << remaining << '\n';
}
```

## 3. 三消遊戲

### 題意與格式

$R\times C$ 盤面以 1 到 5 表示糖果、0 表示空格，初始沒有連線。依序嘗試 $Q$ 次交換，座標**從 1 開始**，兩格保證相鄰。如果任一格是空格，或交換後沒有連續至少三顆同色糖果，交換無效，盤面復原且不消耗補糖。

有效交換後反覆進行：同時標記並消除**所有**橫向、直向連線；各直行的剩餘糖果向下掉；依直行**從左到右**、同一直行空格**由下到上**取補糖序列填入。糖果用完就留下 0，直到沒有連線為止。有效交換的第 $j$ 輪每消一顆得 $j$ 分，下次有效交換從第 1 輪重新計分。

輸入首行為 $R,C,Q,N$，接著是 $R$ 行盤面；若 $N>0$，再讀一行 $N$ 顆補糖；最後是 $Q$ 行 `r1 c1 r2 c2`。輸出有效交換數 $V$、消除總數 $S$、總分 $P$，及最後的 $R$ 行盤面。$R,C\le20$、$Q\le50$、$N\le3000$。

```text
輸入
4 3 2 6
1 2 1
2 1 2
3 2 3
4 4 5
3 1 3 2 3 1
1 2 2 2
3 1 3 2

輸出
1 9 12
0 0 0
1 2 1
3 2 3
4 4 5
```

第一輪消掉 6 顆；補糖後又產生一排 3 顆，第二輪再消 3 顆，總分是 $6+2\times3=12$。第二次交換沒有連線，必須換回去。

### 解法

寫一個 `findMatches`，掃描每一橫列與直行的**極大同色連續段**；長度至少 3 且不為 0，就在布林陣列中標記。最後數標記格數，交叉位置自然只算一次。

對每次交換：先檢查空格，再交換並掃描；沒有連線就換回。有效時按輪次消除標記格，逐列從底往上壓緊糖果，將上方空格依規定順序補入，然後重新掃描。每輪都先完整標記、再一起刪除，才能正確處理同時形成的多條連線。補糖序列的位置只在實際補入時前進。

若全場共消除 $L$ 輪，每輪搜尋、掉落、補糖都花 $O(RC)$；時間 $O((Q+L)RC)$，空間 $O(RC+N)$。每輪至少消掉 3 顆，故 $L\le\lfloor(RC+N)/3\rfloor$。

```cpp
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int R, C, Q, N;
    cin >> R >> C >> Q >> N;
    vector<vector<int>> board(R, vector<int>(C));
    for (int r = 0; r < R; ++r)
        for (int c = 0; c < C; ++c)
            cin >> board[r][c];

    vector<int> supply(N);
    for (int &candy : supply) cin >> candy;
    int nextCandy = 0;

    vector<vector<bool>> marked(R, vector<bool>(C));
    auto findMatches = [&]() {
        for (auto &row : marked) fill(row.begin(), row.end(), false);

        for (int r = 0; r < R; ++r) {
            for (int left = 0; left < C; ) {
                int right = left + 1;
                while (right < C && board[r][right] == board[r][left])
                    ++right;
                if (board[r][left] != 0 && right - left >= 3)
                    for (int c = left; c < right; ++c) marked[r][c] = true;
                left = right;
            }
        }
        for (int c = 0; c < C; ++c) {
            for (int top = 0; top < R; ) {
                int bottom = top + 1;
                while (bottom < R && board[bottom][c] == board[top][c])
                    ++bottom;
                if (board[top][c] != 0 && bottom - top >= 3)
                    for (int r = top; r < bottom; ++r) marked[r][c] = true;
                top = bottom;
            }
        }

        int count = 0;
        for (int r = 0; r < R; ++r)
            for (int c = 0; c < C; ++c)
                count += marked[r][c];
        return count;
    };

    int valid = 0, removedTotal = 0, score = 0;
    for (int q = 0; q < Q; ++q) {
        int r1, c1, r2, c2;
        cin >> r1 >> c1 >> r2 >> c2;
        --r1; --c1; --r2; --c2;
        if (board[r1][c1] == 0 || board[r2][c2] == 0) continue;

        swap(board[r1][c1], board[r2][c2]);
        int removed = findMatches();
        if (removed == 0) {
            swap(board[r1][c1], board[r2][c2]);
            continue;
        }

        ++valid;
        int round = 1;
        while (removed > 0) {
            removedTotal += removed;
            score += round * removed;
            for (int r = 0; r < R; ++r)
                for (int c = 0; c < C; ++c)
                    if (marked[r][c]) board[r][c] = 0;

            for (int c = 0; c < C; ++c) {
                int write = R - 1;
                for (int r = R - 1; r >= 0; --r)
                    if (board[r][c] != 0) board[write--][c] = board[r][c];
                for (int r = write; r >= 0; --r) board[r][c] = 0;
                for (int r = write; r >= 0 && nextCandy < N; --r)
                    board[r][c] = supply[nextCandy++];
            }

            ++round;
            removed = findMatches();
        }
    }

    cout << valid << ' ' << removedTotal << ' ' << score << '\n';
    for (int r = 0; r < R; ++r) {
        for (int c = 0; c < C; ++c) {
            if (c) cout << ' ';
            cout << board[r][c];
        }
        cout << '\n';
    }
}
```

## 4. 排列順序

### 題意與格式

從 $1$ 到 $M$ 選出 $N$ 個互不相同的數字排列，所有長度 $N$ 的數列按字典序排序。給定其中一個數列 $a_1,\ldots,a_N$，求它**從 0 開始**的編號，對 $1\,000\,000\,007$ 取餘數。

輸入第一行 $N,M$，第二行 $N$ 個互異的 $a_i$；輸出一個整數。$1\le N\le M\le200000$。

```text
輸入
3 5
2 5 1

輸出
21
```

### 解法

依序固定與目標數列相同的前綴。來到第 $i$ 位（此處 $i$ 從 0 起算），設 $s_i$ 為**尚未使用、且小於 $a_i$**的數字個數；每選一個比 $a_i$ 小的數字，後面 $N-i-1$ 位都可任意挑未使用的數字排列，所以這一位貢獻

$$
s_i\cdot P(M-i-1,N-i-1)
=s_i\cdot\frac{(M-i-1)!}{(M-N)!}.
$$

用樹狀陣列記錄已用數字，`a[i] - 1 - usedBelow` 就是 $s_i$。階乘先算到 $M$；分母固定為 $(M-N)!$，預先以快速冪求其模逆元。因為 $M<1\,000\,000\,007$，階乘在模數下不為零，可以使用費馬小定理。各位貢獻加總後取模。

以範例來看，首位選比 2 小的 1，後兩位有 $P(4,2)=12$ 種；第二位選未使用、比 5 小的 1、3、4，各有 $P(3,1)=3$ 種。因此編號是 $12+3\times3=21$。每個比目標小的數列都恰好在**第一個不同位置**被算一次，不會重複或漏算。

時間 $O(M+N\log M)$，空間 $O(M)$。

```cpp
#include <iostream>
#include <vector>
using namespace std;

constexpr long long MOD = 1000000007;

long long powerMod(long long base, long long exponent) {
    long long result = 1;
    while (exponent > 0) {
        if (exponent & 1) result = result * base % MOD;
        base = base * base % MOD;
        exponent >>= 1;
    }
    return result;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, M;
    cin >> N >> M;
    vector<int> a(N);
    for (int &value : a) cin >> value;

    vector<long long> factorial(M + 1, 1);
    for (int i = 1; i <= M; ++i)
        factorial[i] = factorial[i - 1] * i % MOD;
    long long inverse = powerMod(factorial[M - N], MOD - 2);

    vector<int> bit(M + 1, 0);
    auto prefix = [&](int index) {
        int sum = 0;
        for (; index > 0; index -= index & -index) sum += bit[index];
        return sum;
    };
    auto markUsed = [&](int index) {
        for (; index <= M; index += index & -index) ++bit[index];
    };

    long long answer = 0;
    for (int i = 0; i < N; ++i) {
        long long smallerUnused = a[i] - 1 - prefix(a[i] - 1);
        long long ways = factorial[M - i - 1] * inverse % MOD;
        answer = (answer + smallerUnused * ways) % MOD;
        markUsed(a[i]);
    }
    cout << answer << '\n';
}
```

## 5. 分段回頭的最大得分

### 題意與格式

共有 $N$ 個時刻，第 $i$ 個時刻價值為 $m_i$。可選任意多段互不重疊的「回頭」區間，每段長度至多 $T$；相鄰兩段中間至少要留 $K$ 個沒回頭的時刻。第一段之前、最後一段之後不用留空。求被選時刻的最大價值總和。

輸入第一行 $N,K,T$，第二行 $N$ 個 $m_i$；輸出最大得分。$N\le4\,000\,000$、$1\le K,T\le N$、$0\le m_i\le10^9$。答案最多約 $4\times10^{15}$，必須用 64 位元整數。

例如下面是依題意自製的小例子：

```text
輸入
6 1 2
5 4 0 10 9 0

輸出
28
```

可以選第 1～2 個時刻和第 4～5 個時刻，中間空出第 3 個時刻，得分 $5+4+10+9=28$。

### 從動態規劃到滑動視窗

令 $p_i=m_1+\cdots+m_i$、$p_0=0$；$F_i$ 是前 $i$ 個時刻的最佳得分，$F_0=0$。若最後一段結束於 $i$，其起點是 $j+1$，則 $i-T\le j\le i-1$（還要有 $j\ge0$）。這段得分是 $p_i-p_j$；前一段若存在，最晚只能結束在 $j-K$。因此定義 $F_x=0$（$x\le0$）後，有

$$
F_i=\max\left(F_{i-1},\;p_i+\max_{\max(0,i-T)\le j\le i-1}\bigl(F_{j-K}-p_j\bigr)\right).
$$

第一項代表第 $i$ 個時刻不回頭；第二項枚舉最後一段的起點，包含「沒有前一段」的情況。直接枚舉 $j$ 需 $O(NT)$，資料量無法承受。

把 $v_j=F_{j-K}-p_j$ 看成一個候選值。計算 $F_i$ 時只需要 $j\in[i-T,i-1]$ 的最大 $v_j$，正好是**滑動視窗最大值**：用值由大到小的單調佇列保存候選的 `(j, v_j)`。每次先移除視窗左端以外的候選，佇列首端就是最大值；算出 $F_i$ 後，再加入 $v_i$。加入前把尾端不大於 $v_i$ 的候選刪掉，因為它們值較小、又會更早過期，以後不可能比較好。

佇列初始放入 $v_0=0$。計算 $v_i$ 時，$F_{i-K}$ 已經算好；若 $i-K\le0$，直接使用 0。每個候選最多進出佇列各一次，故時間 $O(N)$。程式只保存 $F_0\ldots F_N$ 與佇列，邊讀 $m_i$ 邊累加前綴和，不必另存輸入；空間 $O(N+T)$。

```cpp
#include <algorithm>
#include <deque>
#include <iostream>
#include <utility>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N, K, T;
    cin >> N >> K >> T;
    vector<long long> best(N + 1, 0);
    deque<pair<int, long long>> window; // (j, F[j-K] - p[j])
    window.emplace_back(0, 0);

    long long prefixSum = 0;
    for (int i = 1; i <= N; ++i) {
        long long value;
        cin >> value;
        prefixSum += value;

        while (window.front().first < i - T) window.pop_front();
        best[i] = max(best[i - 1], prefixSum + window.front().second);

        long long candidate = best[max(0, i - K)] - prefixSum;
        while (!window.empty() && window.back().second <= candidate)
            window.pop_back();
        window.emplace_back(i, candidate);
    }
    cout << best[N] << '\n';
}
```

這裡要特別檢查兩個邊界：長度為 $T$ 的區間對應 $j=i-T$，必須留在視窗內；兩段之間恰好空 $K$ 個時刻時，上一段的最晚結束位置是 $j-K$，不是 $j-K-1$。
