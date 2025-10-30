<h1 style="text-align: center; font-size: 3rem; margin: 3rem 0 4rem 0;">🔨 Miniscript Studio Intro</h1>

### Miniscript

Bitcoin Script is powerful, enabling multisig, timelocks, vaults, hashlocks, and more. Yet writing raw Script is notoriously complex: it's stack-based, easy to get wrong, hard to compose and full of quirky rules.

Miniscript to the rescue!
It's a structured language that makes Bitcoin scripts safer, analyzable, and composable.

Developed by Pieter Wuille, Andrew Poelstra, and Sanket Kanjalkar, Miniscript bridges the gap between high-level spending policies and low-level Bitcoin Script.

With Miniscript, Bitcoin spending conditions are built in three layers:

* Policy Language: human-readable way to write spending conditions.
* Miniscript: a structured and analyzable representation that ensures correctness and supports composition
* Bitcoin Script: the actual script interpreted by Bitcoin nodes

So the Policy compiles to Miniscript expression that compiles into a Bitcoin Script, represented by an address. Very simple! At the end, it's just an address to receive coins and lock them to the spending conditions. To move them later to another address, you need to satisfy the spending conditions you defined in the Policy.

### Miniscript Studio

Experimenting with Miniscript can still be challenging, which is why I built Miniscript Studio: a complete online IDE for exploring policies, compiling them into scripts, and analyzing every detail. Miniscript Studio comes with detailed examples, range descriptors and Taproot support, key variables, better error messages and more.

Studio uses the [Rust Miniscript](https://github.com/rust-bitcoin/rust-miniscript) crate to compile expressions, and https://bitcoin.sipa.be/miniscript/ as source of truth reference. While these tools exist and are production proven, Studio tries to make Miniscript more accessible and easy to learn, by providing full IDE features around the compiler.

### Policy Editor

The Policy Editor is the starting point for writing spending conditions in a high-level, human-readable format. You can load predefined examples, study their descriptions, and compile them into Miniscript and Bitcoin Script. Just choose an example, press compile, and scroll down for Miniscript details. Compiling policy will always trigger Miniscript compilation, unless it's a Taproot with more than one branch to select.
Read the example descriptions as they cover all technical aspects of the example. You can collapse descriptions to save space.

![](/blog/posts/miniscript-studio-intro-assets/policy.png)

👉 [Try policy-or in Studio](https://adys.dev/miniscript#example=policy-or)

To make policies easier to read and work with, the editor provides formatting options. You can hide key names to display raw values, indent expressions for readability, clean extra characters before compilation, copy, share and more.

![](/blog/posts/miniscript-studio-intro-assets/keynames.gif)

### Miniscript Editor

The Miniscript Editor is for working directly with Miniscript expressions. It accepts pasted expressions or loads examples, and shows detailed compile results with spending analysis. When you compile a policy, it will auto load its result into the Miniscript editor and compile it, but you can work with the Miniscript editor independently, without Policy.

![](/blog/posts/miniscript-studio-intro-assets/miniscript.png)

👉 [Try and_v in Studio](https://adys.dev/miniscript#miniscript=and_v(v%3Apk(Alice)%2Colder(144)))

### Script Area

The Script Area displays the compiled result in multiple formats: hex, ASM, and as an address. You can toggle between mainnet and testnet, or switch between Legacy, SegWit, and Taproot contexts and compile again. Note that Taproot uses x-only keys, make sure to choose the right context for your keys.

![](/blog/posts/miniscript-studio-intro-assets/script.png)

### Extract Keys

Miniscript requires real public keys, but users may not have them handy. The Extract Keys function automatically generates the missing keys.

For example, writing "or(pk(Nadav),pk(Aviv))" without defining Nadav and Aviv may raise a compilation error, as the compiler doesn't recognize Nadav or Aviv variables.

By clicking the Extract Keys button, usable public keys are generated automatically so the expression compiles without errors. Same goes when using hex values in expressions - extract keys will create new keys var for the missing keys (only), so you can use the names in the expression, instead of hex values.

You can also just choose "Extract keys" from the error message itself.

![](/blog/posts/miniscript-studio-intro-assets/keyextract.gif)

### Key Variables Management

If you need even more control, the Key Variables section allows you to manage key values manually. You can add, edit, or delete variables, and generate them from predefined pools. Keys are always stored locally in the browser's local storage.

![](/blog/posts/miniscript-studio-intro-assets/keyvars.png)

### Default Variables

Miniscript Studio comes with predefined example keys to help you get started immediately: Alice, Bob, Charlie, Dave, Eva etc. You can see the full list under the key variable section.

These default variables let you experiment instantly. For example, you can immediately use them in policies like this:

- or(pk(Alice),pk(Bob))
- thresh(2,pk(Alice),pk(Bob),pk(Charlie))

You can also override any default by defining your value to any key. You made a mess? Getting errors when trying to compile default examples? No problem. Just hit "restore defaults" to regenerate all default keys.

### HD Wallet Descriptors

Miniscript Studio supports hierarchical deterministic (HD) wallet descriptors, including xpubs and tpubs. When range descriptors are used, the editor provides an index field for address derivation and supports multipath syntax for external/change branches. This way you can work with complex expressions with multiple descriptors without the hassle of editing the expression.

![](/blog/posts/miniscript-studio-intro-assets/desc.png)

![](/blog/posts/miniscript-studio-intro-assets/index.gif)

👉 [Try Range descriptor in Studio](https://adys.dev/miniscript#example=miniscript-range_descriptor)

### Lift Functionality

The lift feature allows raw Bitcoin Script to be reversed into Miniscript and Policy form. You can lift from Script to Miniscript, and from Miniscript to Policy! Lifting is fun.

For example, pasting the ASM "Alice OP_CHECKSIG OP_IFDUP OP_NOTIF Bob OP_CHECKSIGVERIFY 144 OP_CHECKSEQUENCEVERIFY OP_ENDIF" produces the Miniscript "or_d(pk(Alice),and_v(v:pk(Bob),older(144)))" and the higher-level policy "or(pk(Alice),and(pk(Bob),older(144)))". This makes complex raw scripts far easier to understand, especially with Policy representation.

![](/blog/posts/miniscript-studio-intro-assets/lift.gif)

Keep in mind that not all scripts can be lifted. For example, scripts with public key hashes can't be lifted. However, valid Miniscript expressions can, and sometimes it's much easier to read them in Policy format.

👉 [Try to lift this Miniscript expression in Studio.](https://adys.dev/miniscript#example=miniscript-complex)


### Taproot Support

Taproot introduced new ways of structuring Bitcoin outputs, and Miniscript Studio provides full support for exploring them. You can load Taproot policy examples and compile them in single-leaf/key, script-path, or key+script path contexts.

Compiling the policy "or(pk(David),or(pk(Helen),pk(Uma)))" shows how the same logic can be represented in different Taproot contexts, with branch expressions automatically loaded into the Miniscript editor for inspection. When there are multiple branches, Studio provides a UI to choose what Miniscript expression to load into the editor.

![](/blog/posts/miniscript-studio-intro-assets/poltap.png)

👉 [Try Multi branch policy in Studio](https://adys.dev/miniscript#example=policy-multi_branch)

### Taproot Miniscript

When working with Taproot Miniscript expressions, the expression will compile into one leaf script, in all contexts, but with some differences.
Single leaf/Key context shows the leaf info ASM for simplicity, and if it's a key only, it will optimize to a key-only taproot. The other contexts show more leaf details and spend info. The script + key path context also provides key path spending info and compiles the internal key of the expression instead of NUMS.

![](/blog/posts/miniscript-studio-intro-assets/minitap.png)

👉 [Try Liquid Federation in Studio](https://adys.dev/miniscript#example=miniscript-liquid_federation)

### Debug

After a successful compilation, you can press the debug button 🐞 to see more information returned from the Miniscript Rust library compilation, including Miniscript types.

![](/blog/posts/miniscript-studio-intro-assets/debug.png)

### Additional Features

Miniscript Studio also includes Policy and Miniscript references, based on sipa's Miniscript documentation, and settings to customize the workspace. Descriptions and tips can be hidden for a cleaner view, you can choose your theme, activate auto compile and more. Users can save and load their work at any time and sharing examples is easy, including new policies (use JSON share format to include new variables). It's also worth exploring the tips and quick info section.

### Closing Thoughts

Miniscript is changing how we approach Bitcoin script development, from manual scripting to structured, verifiable spending conditions. Miniscript Studio aims to bring this technology to developers at all levels through visual analysis, better error messages, automatic key management, and full descriptor and Taproot support. But it's not only for experienced developers, it can help beginners understand Bitcoin spending conditions more easily, using Policy language. Whether you're exploring your first multisig setup or designing complex vault architectures, the Studio provides the tools and information needed to build with confidence. 
Studio contains all the features I ever wanted in my Miniscript journey.

I hope this tool helps developers explore the full potential of Miniscript.

Feedback and contributions are always welcome.

👉 Start building: [https://adys.dev/miniscript](https://adys.dev/miniscript)

---

Follow me on Twitter: [@adyshimony](https://x.com/adyshimony)
