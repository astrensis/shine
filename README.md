# shine ─ 助けてください～既読スルー禁止～

LINE風チャットサバイバルホラーWebゲーム。深夜、3人からSOSが届く ── 既読スルーは、できない。

## 収録シナリオ

| キャラ | タイトル | ジャンル |
| --- | --- | --- |
| アオイ | 真夜中のドアスコープ | 人コワ・サスペンス |
| タクヤ | 霧の旧トンネル | 現代怪異・オカルト |
| リョウ | 深夜ワンオペの閉店後 | 極限密室・パニック |

選択肢によって「救出成功」または「音信不通（BAD END）」に分岐します。

## すぐ遊ぶ（ビルド不要）

`artifact/index.html` を開くだけで動作する単一ファイル版（Vanilla JS + Web Audio API + SVG）です。

## 開発版（Vite + React + TypeScript + Tailwind CSS）

`src/` 以下がソース本体です。

```bash
npm install
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド
```

### 技術スタック

- React 18 + TypeScript + Vite
- Tailwind CSS
- lucide-react（アイコン）
- Web Audio API（受信音・送信音・心音・恐怖ノイズ・通話切断音・警報音を全てプログラム生成。外部音声ファイル不使用）
- localStorage（クリア状況・BAD END状況の永続化）

### ディレクトリ構成

```
src/
├── components/
│   ├── ChatRoom.tsx        # トーク画面
│   ├── ChatList.tsx        # トーク一覧画面
│   ├── MessageBubble.tsx   # メッセージフキダシ
│   ├── TypingIndicator.tsx # 「入力中...」アニメーション
│   ├── ResultModal.tsx     # リザルトモーダル
│   └── EeriImage.tsx       # SVGによる不穏な画像プレースホルダー
├── data/
│   └── scenarios.ts        # 3本のシナリオデータ
├── utils/
│   ├── sound.ts             # Web Audio APIサウンドジェネレータ
│   └── storage.ts           # セーブデータ管理
├── types/
│   └── game.ts               # 型定義
├── App.tsx
└── main.tsx
```
