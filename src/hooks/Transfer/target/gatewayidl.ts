export const GatewayIDL = {
  address: "ZETAjseVjuFsxdRxo6MmTCvqFwb3ZHUx56Co3vCmGis",
  metadata: {
    name: "gateway",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "deposit",
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "receiver",
          type: {
            array: ["u8", 20],
          },
        },
      ],
    },
    {
      name: "deposit_and_call",
      discriminator: [65, 33, 186, 198, 114, 223, 133, 57],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "receiver",
          type: {
            array: ["u8", 20],
          },
        },
        {
          name: "message",
          type: "bytes",
        },
      ],
    },
    {
      name: "deposit_spl_token",
      discriminator: [86, 172, 212, 121, 63, 233, 96, 144],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "whitelist_entry",
          pda: {
            seeds: [
              {
                kind: "const",
                value: [119, 104, 105, 116, 101, 108, 105, 115, 116],
              },
              {
                kind: "account",
                path: "mint_account",
              },
            ],
          },
        },
        {
          name: "mint_account",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "from",
          writable: true,
        },
        {
          name: "to",
          writable: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "receiver",
          type: {
            array: ["u8", 20],
          },
        },
      ],
    },
    {
      name: "deposit_spl_token_and_call",
      discriminator: [14, 181, 27, 187, 171, 61, 237, 147],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "whitelist_entry",
          pda: {
            seeds: [
              {
                kind: "const",
                value: [119, 104, 105, 116, 101, 108, 105, 115, 116],
              },
              {
                kind: "account",
                path: "mint_account",
              },
            ],
          },
        },
        {
          name: "mint_account",
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "from",
          writable: true,
        },
        {
          name: "to",
          writable: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "receiver",
          type: {
            array: ["u8", 20],
          },
        },
        {
          name: "message",
          type: "bytes",
        },
      ],
    },
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "tss_address",
          type: {
            array: ["u8", 20],
          },
        },
        {
          name: "chain_id",
          type: "u64",
        },
      ],
    },
    {
      name: "set_deposit_paused",
      discriminator: [98, 179, 141, 24, 246, 120, 164, 143],
      accounts: [
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "signer",
          writable: true,
          signer: true,
        },
      ],
      args: [
        {
          name: "deposit_paused",
          type: "bool",
        },
      ],
    },
    {
      name: "unwhitelist_spl_mint",
      discriminator: [73, 142, 63, 191, 233, 238, 170, 104],
      accounts: [
        {
          name: "whitelist_entry",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [119, 104, 105, 116, 101, 108, 105, 115, 116],
              },
              {
                kind: "account",
                path: "whitelist_candidate",
              },
            ],
          },
        },
        {
          name: "whitelist_candidate",
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "authority",
          writable: true,
          signer: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "signature",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "recovery_id",
          type: "u8",
        },
        {
          name: "message_hash",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "nonce",
          type: "u64",
        },
      ],
    },
    {
      name: "update_authority",
      discriminator: [32, 46, 64, 28, 149, 75, 243, 88],
      accounts: [
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "signer",
          writable: true,
          signer: true,
        },
      ],
      args: [
        {
          name: "new_authority_address",
          type: "pubkey",
        },
      ],
    },
    {
      name: "update_tss",
      discriminator: [227, 136, 3, 242, 177, 168, 10, 160],
      accounts: [
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "signer",
          writable: true,
          signer: true,
        },
      ],
      args: [
        {
          name: "tss_address",
          type: {
            array: ["u8", 20],
          },
        },
      ],
    },
    {
      name: "whitelist_spl_mint",
      discriminator: [30, 110, 162, 42, 208, 147, 254, 219],
      accounts: [
        {
          name: "whitelist_entry",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [119, 104, 105, 116, 101, 108, 105, 115, 116],
              },
              {
                kind: "account",
                path: "whitelist_candidate",
              },
            ],
          },
        },
        {
          name: "whitelist_candidate",
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "authority",
          writable: true,
          signer: true,
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "signature",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "recovery_id",
          type: "u8",
        },
        {
          name: "message_hash",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "nonce",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw",
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "to",
          writable: true,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "signature",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "recovery_id",
          type: "u8",
        },
        {
          name: "message_hash",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "nonce",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw_spl_token",
      discriminator: [219, 156, 234, 11, 89, 235, 246, 32],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "pda",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [109, 101, 116, 97],
              },
            ],
          },
        },
        {
          name: "pda_ata",
          writable: true,
        },
        {
          name: "mint_account",
        },
        {
          name: "recipient",
        },
        {
          name: "recipient_ata",
          docs: ["the validation will be done in the instruction processor."],
          writable: true,
        },
        {
          name: "token_program",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "associated_token_program",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "decimals",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "signature",
          type: {
            array: ["u8", 64],
          },
        },
        {
          name: "recovery_id",
          type: "u8",
        },
        {
          name: "message_hash",
          type: {
            array: ["u8", 32],
          },
        },
        {
          name: "nonce",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "Pda",
      discriminator: [169, 245, 0, 205, 225, 36, 43, 94],
    },
    {
      name: "WhitelistEntry",
      discriminator: [51, 70, 173, 81, 219, 192, 234, 62],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "SignerIsNotAuthority",
      msg: "SignerIsNotAuthority",
    },
    {
      code: 6001,
      name: "InsufficientPoints",
      msg: "InsufficientPoints",
    },
    {
      code: 6002,
      name: "NonceMismatch",
      msg: "NonceMismatch",
    },
    {
      code: 6003,
      name: "TSSAuthenticationFailed",
      msg: "TSSAuthenticationFailed",
    },
    {
      code: 6004,
      name: "DepositToAddressMismatch",
      msg: "DepositToAddressMismatch",
    },
    {
      code: 6005,
      name: "MessageHashMismatch",
      msg: "MessageHashMismatch",
    },
    {
      code: 6006,
      name: "MemoLengthExceeded",
      msg: "MemoLengthExceeded",
    },
    {
      code: 6007,
      name: "MemoLengthTooShort",
      msg: "MemoLengthTooShort",
    },
    {
      code: 6008,
      name: "DepositPaused",
      msg: "DepositPaused",
    },
    {
      code: 6009,
      name: "SPLAtaAndMintAddressMismatch",
      msg: "SPLAtaAndMintAddressMismatch",
    },
    {
      code: 6010,
      name: "EmptyReceiver",
      msg: "EmptyReceiver",
    },
  ],
  types: [
    {
      name: "Pda",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nonce",
            type: "u64",
          },
          {
            name: "tss_address",
            type: {
              array: ["u8", 20],
            },
          },
          {
            name: "authority",
            type: "pubkey",
          },
          {
            name: "chain_id",
            type: "u64",
          },
          {
            name: "deposit_paused",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "WhitelistEntry",
      type: {
        kind: "struct",
        fields: [],
      },
    },
  ],
};
