# splinterlands-guild-kicker
List members that do not contribute enough to the guild.

The formula used for determining if a member contributes enough to the guild is:
```
mj < (cd/ed + cq/eq) * help

```

where:

- mj = "months since the member joined"
- cd = "all time contributed DEC"
- cq = "all time constributed quests"
- ed = "expected DEC per month"
- eq = "expected quests per month"
- help = "multiplier that goes between 1 and 6 depending on the member league (can be disabled)"
