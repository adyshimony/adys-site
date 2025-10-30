<h1 style="text-align: center; font-size: 3rem; margin: 3rem 0 4rem 0;">Miniscript - Policy Language</h1>

### Introduction

Miniscript and surly Script are for devlopers, thats true.
I think Policy should not be. I think its important for users to understand Policy language as its teaches them a lot about Bitcoin and specially on spending conditions. By learning the possiblities, a user can choose the better custody solusion, avoid risks and more. Time lock? that scary. But after(144)? That more understanable, that is human readable.

Every Bitcoin output has spending conditions - rules that determine who can spend the funds and when. Traditionally, creating these rules meant writing complex scripts that's difficult to understand and easy to get wrong.

Miniscript and specially **Policy Language** changes this completely. It lets you write spending conditions in plain, human readable statements. More than that, it help you learn what are the availble spending conditions in Bitcoin.

Now its true that if you are not a tech person that write a wallet or learning Miniscript, you most likely will ever write a policy.
But its really woth knowing how to read them and more important, knowing the existing posibilities in Bitcoin. Did you know for example that you can delay the sepnding of a coin? prepare a backup key? create a multisig wallet? 

In this post we will keep things simple, so we will not get into Miniscript and Script, only how Policy works.

### What is Policy Language?

Policy Language is a simple way to express Bitcoin spending conditions. Think of it as writing the rules for your Bitcoin in simple words that anyone can read and understand. That what we called, human readable format.

A basic policy:
```
or(pk(Alice),pk(Bob))
```

This reads very simple: "Either Alice can sign, OR Bob can sign."

A reminder - this expression compiles to a Miniscript and then to a script that represented by an address. When someone sends Bitcoin to this address, they're locking it according to the spending conditions of the policy that created the address. 
To move thoes funds later, you need to satisfy the conditions. 

### Policy Language Primitives

Let's explore all the building blocks you can use to create policies expressions.

#### pk(KEY)

Requires a digital signature from the specified public key. The simplest spending condition - only the holder of the corresponding private key can create a valid signature to spend the funds.
```
pk(Alice)
```


**Spending Conditions**:

- **Alice**: Immediate spending (no restrictions)

**Security considerations**:

- **Single point of failure**: If Alice loses her key, funds are permanently lost
- **Most efficient**: Direct compilation to `OP_CHECKSIG`, minimal overhead
- **No backup**: No recovery mechanism if key is compromised or lost

**Use case**: Personal hot wallet, simple ownership, individual daily-use wallet, situations where efficiency matters more than redundancy

## or(POLICY1,POLICY2)

Either policy can be satisfied - at least one must be true. Provides flexibility by allowing multiple spending paths.

**Example - Backup key**:

```
or(pk(Alice),pk(Bob))
```

**Spending Conditions**:

- **Alice**: Can spend anytime
- **Bob**: Can spend anytime

Either Alice OR Bob can spend (1-of-2).

**Example - Recovery with timelock**:

```
or(pk(Owner),and(pk(Recovery),older(4320)))
```

**Spending Conditions**:

- **Owner**: Immediate spending (no restrictions)
- **Recovery**: Can spend after 30 days (~4320 blocks)

Owner can spend anytime, OR recovery key after waiting period.

**Security considerations**:

- **Redundancy**: Multiple spending paths prevent lockout
- **Weakest link**: Security is only as strong as the easiest-to-compromise path
- **Flexible recovery**: Time-delayed paths provide safety against key compromise

**Use case**: Wallet recovery, inheritance planning, backup spending paths, emergency access

## and(POLICY1,POLICY2)

Both policies must be satisfied. Requires meeting all conditions simultaneously - useful for combining signatures with time delays or multiple authorizations.

**Example - 2-of-2 multisig**:

```
and(pk(Alice),pk(Bob))
```

**Spending Conditions**:

- **Both required**: Alice AND Bob must both sign

Both parties must approve every transaction.

**Example - Delayed spending**:

```
and(pk(Alice),older(144))
```

**Spending Conditions**:

- **Alice's signature required**
- **Must wait**: 144 blocks (~1 day) after UTXO confirmation

Alice can spend, but only after waiting period.

**Security considerations**:

- **Stronger security**: Requires multiple conditions, harder to compromise
- **Higher risk of lockout**: All conditions must be met - losing any means losing funds
- **Time delays**: Protect against impulsive or compromised transactions
- **Coordination required**: All parties must be available and cooperate

**Use case**: Joint accounts, time-delayed spending, collaborative custody, theft protection with delays

## thresh(K,POLICY1,POLICY2,...,POLICYN)

At least K out of N policies must be satisfied (K-of-N threshold). The most flexible way to require multiple approvals while tolerating some key loss.

**Example - 2-of-3 multisig**:

```
thresh(2,pk(Alice),pk(Bob),pk(Charlie))
```

**Spending Conditions**:

- **Any 2 of 3**: Alice + Bob, Alice + Charlie, or Bob + Charlie

Any 2 out of 3 must sign.

**Example - 3-of-5 multisig**:

```
thresh(3,pk(Key1),pk(Key2),pk(Key3),pk(Key4),pk(Key5))
```

**Spending Conditions**:

- **Any 3 of 5**: Any combination of 3 signatures

Any 3 out of 5 must sign.

**Example - Mixed conditions**:

```
thresh(2,pk(Alice),pk(Bob),older(144))
```

**Spending Conditions**:

- **Option 1**: Alice + Bob (immediate)
- **Option 2**: Alice + wait 144 blocks
- **Option 3**: Bob + wait 144 blocks

Two conditions must be met from: Alice signs, Bob signs, or 144 blocks passed.

**Security considerations**:

- **Balanced security**: Tolerates up to N-K key losses without fund loss
- **Flexible**: Can mix keys with other conditions (time delays, hashes)
- **Coordination complexity**: More signers = harder to coordinate
- **Industry standard**: Most common setup for serious Bitcoin custody

**Use case**: Multisig wallets, corporate treasuries, distributed key management, family shared custody

## after(LOCKTIME)

Requires waiting until an absolute block height or Unix timestamp. Funds cannot be spent before a specific date or block number.

**Example - Block height**:

```
after(750000)
```

**Spending Conditions**:

- **Locked until block 750000**: Cannot spend before this block is mined

Can be spent only after block 750000.

**Example - Unix timestamp**:

```
after(1735689600)
```

**Spending Conditions**:

- **Locked until January 1, 2025**: Cannot spend before this date

Can be spent only after specific date.

**Example - Inheritance with deadline**:

```
or(pk(Owner),and(pk(Heir),after(800000)))
```

**Spending Conditions**:

- **Owner**: Can spend anytime (no restrictions)
- **Heir**: Can spend only after block 800000

Owner controls now, heir can spend after deadline passes.

**Important**: Values below 500000000 are block heights; 500000000 and above are Unix timestamps.

**Security considerations**:

- **Predictable timeline**: Know exactly when funds become available
- **Irreversible**: Cannot access funds before the deadline, even in emergencies
- **Inheritance planning**: Perfect for passing funds to heirs at specific time
- **Network dependent**: Block height deadlines depend on mining rate (~10 min/block)

**Use case**: Time-locked savings, inheritance with specific dates, scheduled payments, trustless escrow

## older(BLOCKS)

Requires waiting a relative number of blocks after the UTXO is confirmed. The countdown starts when the transaction is included in a block.

**Example**:

```
older(144)
```

**Spending Conditions**:

- **Wait 144 blocks**: Must wait ~1 day after UTXO confirmation

Can be spent 144 blocks (~1 day) after UTXO confirmation.

**Example - Vault with delay**:

```
or(thresh(2,pk(Cold1),pk(Cold2)),and(pk(Hot),older(144)))
```

**Spending Conditions**:

- **Cold keys (immediate)**: Cold1 + Cold2 can spend right away
- **Hot key (delayed)**: Hot wallet must wait 144 blocks (~1 day)

2 cold keys for immediate spend, OR hot key after 1-day delay.

**Security considerations**:

- **Theft protection**: Gives time to notice and react to unauthorized transactions
- **Relative timing**: Countdown starts from confirmation, not a fixed date
- **Vault security**: Hot wallet compromise doesn't mean instant loss
- **Usability tradeoff**: Delays reduce convenience for legitimate use

**Use case**: Vault systems, payment channels, theft protection with delays, exchange hot wallets

## Probability-Weighted OR

Optimize OR branches based on expected usage patterns. Tell the compiler which spending path you'll use more often, and it will make that path slightly cheaper.

**Syntax**:

```
or(K@POLICY1,N@POLICY2)
```

The ratio K:N tells the compiler which path will be used more often, allowing it to optimize for cheaper spending on the common path.

**Example - 90% main, 10% backup**:

```
or(9@pk(Alice),1@pk(Bob))
```

**Spending Conditions**:

- **Alice (90% - optimized)**: Slightly cheaper to spend
- **Bob (10% - backup)**: Slightly more expensive to spend

Optimizes for Alice being used 90% of the time.

**Example - Rare recovery path**:

```
or(99@pk(Owner),1@and(pk(Recovery),older(26280)))
```

**Spending Conditions**:

- **Owner (99% - optimized)**: Cheaper daily use
- **Recovery (1% - emergency)**: More expensive, only if needed after ~6 months

Optimizes for normal operation, making emergency recovery slightly more expensive.

**When to use**: When you know which spending path will be more common and want to minimize average transaction costs.

**Security considerations**:

- **Cost optimization**: Saves fees on commonly-used paths
- **Guess wrong**: If you misjudge probabilities, you'll pay more fees
- **Same security**: Optimization doesn't affect security, only costs
- **Optional feature**: If unsure, use regular `or()` without weights

**Use case**: Hot/cold wallet optimization, rarely-used recovery paths, known usage patterns

## Hash-Based Policies

Hash-based policies require revealing a secret (preimage) that produces a specific hash value. Essential for conditional payments and atomic swaps where someone must prove they know a secret.

### sha256(HASH)

Requires revealing secret data that hashes to the specified SHA256 hash. The hash is public, but only someone with the secret preimage can spend.

**Example**:

```
sha256(b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c)
```

**Spending Conditions**:

- **Must provide secret**: The preimage that hashes to this value

Spending requires providing the secret that produces this hash.

**Example - HTLC (Hash Time Locked Contract)**:

```
or(and(pk(Alice),sha256(H)),and(pk(Bob),older(144)))
```

**Spending Conditions**:

- **Alice with secret**: Can claim immediately if she knows the preimage
- **Bob after timeout**: Can reclaim after 144 blocks if Alice doesn't claim

Alice can claim with hash preimage, OR Bob reclaims after timeout.

**Security considerations**:

- **Conditional payment**: Payment only releases when secret is revealed
- **Atomic swaps**: Same secret can unlock multiple chains simultaneously
- **Secret must stay secret**: Once revealed on-chain, anyone can see it
- **No counterparty trust**: Cryptography enforces the contract

**Use case**: HTLCs, Lightning Network, atomic swaps, conditional payments, cross-chain trades

### hash256(HASH)

Requires revealing data that double-hashes (SHA256 twice) to the specified hash. Uses Bitcoin's double-SHA256 standard.

**Example**:

```
hash256(5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456)
```

**Spending Conditions**:

- **Must provide secret**: The preimage that double-hashes to this value

Uses Bitcoin's double-SHA256 (like block hashes).

**Use case**: Similar to sha256 but follows Bitcoin's double-hash convention

### ripemd160(HASH)

Requires revealing data that hashes to the specified RIPEMD160 hash.

**Example**:

```
ripemd160(3b4f645b5e1e0e8d7e4b5f645b5e1e0e8d7e4b5f)
```

**Spending Conditions**:

- **Must provide secret**: The preimage that hashes to this RIPEMD160 value

**Use case**: Legacy compatibility, specific hash schemes

### hash160(HASH)

Requires revealing data that hashes to the specified HASH160 (SHA256 followed by RIPEMD160). This is Bitcoin's standard address hashing method.

**Example**:

```
hash160(3b4f645b5e1e0e8d7e4b5f645b5e1e0e8d7e4b5f)
```

**Spending Conditions**:

- **Must provide secret**: The preimage that hashes to this HASH160 value

Uses Bitcoin's standard address hashing (SHA256 → RIPEMD160).

**Use case**: Compatible with Bitcoin's address hash standard

## Practical Real-World Examples

Here's how to combine primitives to build real custody solutions.

### Example 1: Simple 2-of-3 Multisig

**Policy**:

```
thresh(2,pk(Alice),pk(Bob),pk(Charlie))
```

**Description**: Any 2 out of 3 signatures required.

**Use case**: Personal multisig wallet, small company treasury

### Example 2: Time-Locked Vault

**Policy**:

```
or(thresh(2,pk(ColdKey1),pk(ColdKey2)),
   and(pk(HotKey),older(144)))
```

**Description**: 2 cold keys for immediate access, OR hot key after 1-day delay.

**Use case**: Exchange security - protects against hot wallet compromise with delay

### Example 3: Inheritance Setup

**Policy**:

```
or(pk(Owner),
   and(thresh(2,pk(Heir1),pk(Heir2),pk(Heir3)),
       after(800000)))
```

**Description**: Owner spends anytime, OR 2-of-3 heirs after block 800000.

**Use case**: Bitcoin inheritance with absolute deadline

### Example 4: Lightning-Style HTLC

**Policy**:

```
or(and(pk(Alice),sha256(b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c)),
   and(pk(Bob),older(144)))
```

**Description**: Alice claims with hash preimage, OR Bob reclaims after timeout.

**Use case**: Payment channels, atomic swaps, conditional payments

### Example 5: Social Recovery Wallet

**Policy**:

```
or(pk(Owner),
   thresh(3,pk(Guardian1),pk(Guardian2),pk(Guardian3),pk(Guardian4),pk(Guardian5)))
```

**Description**: Owner controls normally, OR 3-of-5 guardians recover.

**Use case**: Self-custody with social backup

### Example 6: Corporate Treasury

**Policy**:

```
thresh(2,
    pk(CEO),
    pk(CFO),
    pk(CTO),
    and(pk(AuditKey),older(4320)))
```

**Description**: Any 2 executives immediately, but audit key requires 30-day delay.

**Use case**: Corporate governance with compliance oversight

### Example 7: Degrading Multisig

**Policy**:

```
or(thresh(3,pk(Key1),pk(Key2),pk(Key3),pk(Key4),pk(Key5)),
   and(thresh(2,pk(Key1),pk(Key2),pk(Key3),pk(Key4),pk(Key5)),older(1000)),
   and(pk(RecoveryKey),older(10000)))
```

**Description**: Starts as 3-of-5, degrades to 2-of-5 after ~1 week, then single recovery key after ~10 weeks.

**Use case**: Balancing security with key loss resilience over time

### Example 8: Payment Channel

**Policy**:

```
or(and(pk(Alice),pk(Bob)),
   and(pk(Alice),older(1008)))
```

**Description**: Both parties cooperate to close, OR Alice refunds after ~1 week.

**Use case**: Unilateral channel closing

### Example 9: Atomic Swap

**Policy**:

```
or(and(pk(Alice),sha256(H)),
   and(pk(Bob),after(1735689600)))
```

**Description**: Alice claims with preimage, OR Bob reclaims after deadline.

**Use case**: Cross-chain atomic swaps with absolute timeout

### Example 10: Emergency Recovery Vault

**Policy**:

```
or(9@thresh(2,pk(Key1),pk(Key2),pk(Key3)),
   1@and(pk(EmergencyKey),older(26280)))
```

**Description**: Normal 2-of-3 (optimized), emergency key after ~6 months (if needed).

**Use case**: Long-term cold storage with emergency escape hatch

## Policy Tips and Best Practices

### 1. Start Simple

Begin with `pk`, `or`, `and` before adding complexity. Build incrementally.

### 2. Use Descriptive Names

- Good: `pk(Owner)`, `pk(BackupKey)`
- Bad: `pk(Key1)`, `pk(Key2)`

### 3. Always Include Recovery Paths

Never create single-point-of-failure policies. Examples:

- Social recovery with guardians
- Time-delayed backup keys
- Degrading thresholds

### 4. Understand Time Units

- `after()` and `older()` values < 500000000 = blocks
- Values ≥ 500000000 = Unix timestamps
- Don't mix them incorrectly!

### 5. Consider Spending Costs

More complex = higher fees. Balance security with efficiency:

- Simple `pk()`: ~67 vbytes
- 2-of-3 `thresh()`: ~140 vbytes
- Complex vaults: 200+ vbytes

### 6. Test Before Deploying

Use [Miniscript Studio](https://adys.dev/miniscript) to:

- Validate syntax
- Compile to Miniscript and Script
- Analyze spending costs
- Generate testnet addresses

### 7. Document Your Policies

Record:

- What the policy does
- Why you chose this structure
- Who holds which keys
- Recovery procedures

### 8. Use Probability Weights Wisely

Only use weighted `or()` when you genuinely know usage patterns. Otherwise let the compiler optimize.

### 9. Plan for Key Loss

Assume keys will be lost. Design accordingly:

- Multiple recovery paths
- Time-delayed alternatives
- Degrading security thresholds

### 10. Know Your Limits

Some policies can't be compiled:

- Policies exceeding script size limits
- Unsatisfiable combinations
- Circular dependencies

## Additional Primitive: pkh(KEY)

### pkh(KEY)

**Description**: Requires a signature from the key whose public key hash matches.

**Syntax**:

```
pkh(KEY)
```

**Example**:

```
pkh(Bob)
```

Uses the OP_DUP OP_HASH160 pattern (like traditional P2PKH addresses).

**Note**: Less common in modern Miniscript - `pk()` is more efficient in SegWit/Taproot.

**Use case**: Legacy compatibility, traditional address formats

## Policy Limitations

Some policies **cannot be compiled**:

### Size Limits

- P2WSH: ~3,600 bytes practical limit
- Taproot: 10,000 bytes per leaf
- Too complex policies exceed these limits

### Unsatisfiable Combinations

Example: `and(after(100000),after(200000))` in one input - impossible to satisfy both

### Resource Limits

Bitcoin consensus limits:

- Stack size
- Script execution steps
- Signature operations

When compilation fails, [Miniscript Studio](https://adys.dev/miniscript) shows detailed error messages.

## Testing Your Policies

**Use [Miniscript Studio](https://adys.dev/miniscript) to**:

1. Write and validate policy syntax
2. Compile to Miniscript and Bitcoin Script
3. Analyze spending costs
4. Generate testnet/mainnet addresses
5. Compare policy alternatives
6. Understand spending paths

**Always test on testnet first** before deploying to mainnet.

## Conclusion

Miniscript's Policy Language transforms Bitcoin spending conditions from complex, error-prone scripts into simple, readable statements.

By mastering the core primitives - `pk`, `or`, `and`, `thresh`, `after`, `older`, probability weights, and hash functions - you can design sophisticated custody solutions: multisig wallets, vaults, inheritance plans, HTLCs, social recovery, and more.

Policy makes Bitcoin Script **safe**, **analyzable**, and **composable** - essential for modern Bitcoin custody.

👉 **Start building**: [https://adys.dev/miniscript](https://adys.dev/miniscript)

👉 **Learn more**: [Bitcoin Miniscript Docs](https://bitcoin.sipa.be/miniscript/)

👉 **Rust Library**: [rust-miniscript](https://github.com/rust-bitcoin/rust-miniscript)

*Questions? Reach out via [GitHub](https://github.com/adyshimony) or [Twitter/X](https://x.com/adyshimony).*
