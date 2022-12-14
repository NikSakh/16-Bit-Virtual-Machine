const createMemory = require('./create-memory');
const instructions = require('./instructions');

class CPU {
	constructor(memory){
		this.memory = memory;

		this.registerNames = [
		'ip', 'acc',
		'r1', 'r2', 'r3', 'r4',
		'r5', 'r6', 'r7', 'r8',
		'sp', 'fp'
		];

		this.registers = createMemory(this.registerNames.length * 2);

		this.registerMap = this.registerNames.reduce((map, name, i) => {
			map[name] = i * 2;
			return map;
		}, {});

		this.setRegister('sp', memory.byteLength - 1 - 1);
		this.setRegister('sp', memory.byteLength - 1 - 1);
	}

	debug(){
		this.registerNames.forEach(name => {
			console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`);
		});
		console.log();
	}

	viewMemoryAt(address){
		const nextEightBytes = Array.from({length: 8}, (_, i) =>
			this.memory.getUint8(address + i)
			).map(v => `0x${v.toString(16).padStart(2, '0')}`);
		console.log(`0x${address.toString(16).padStart(4, '0')}: ${nextEightBytes.join(' ')}`);
	}

	getRegister(name) {
		if(!(name in this.registerMap)){
			throw new Error('getRegister: No such register '${name});
		}
		return this.registers.getUint16(this.registerMap[name]);
	}

	getRegister(name, value) {
		if(!(name in this.registerMap)){
			throw new Error('getRegister: No such register '${name});
		}
		return this.registers.setUint16(this.registerMap[name], value);
	}

	fetch(){
		const nextInstructionAddress = this.getRegister('ip');
		const instruction = this.memory.getUint8(nextInstructionAddress);
		this.setRegister('ip', nextInstructionAddress + 1);
		return instruction;
	}


	fetch16(){
		const nextInstructionAddress = this.getRegister('ip');
		const instruction = this.memory.getUint16(nextInstructionAddress);
		this.setRegister('ip', nextInstructionAddress + 2);
		return instruction;
	}

	push(value){
		const spAddress = this.getRegister('sp');
		this.memory.setUint16(spAddress, value);
		this.setRegister('sp', spAddress - 2);
	}

	fetchRegisterIndex(){
		return (this.fetch() % this.registerNames.length) * 2;
	}

	pop(){
		const nextSpAddress = this.getRegister('sp') + 2;
		this.setRegister('sp', nextSpAddress);
		return this.memory.getUint16(nextSpAddress);
		 
	}

	execute(instruction){
		switch (instruction){

			//Move literal into register
			case instructions.MOV_LIT_REG: {
				const literal = this.fetch16();
				const register = this.fetchRegisterIndex();
				this.registers.setUint16(register, literal);
				return;
			}

			//Move register to register
			case instructions.MOV_REG_REG: {
				const registerFrom = this.fetchRegisterIndex();
				const registerTo = this.fetchRegisterIndex();
				const value = this.registers.getUint16(registerFrom);
				this.registers.setUint16(registerTo, value);
				return;
			}

			//Move register to memory
			case instructions.MOV_REG_MEM: {
				const registerFrom = this.fetchRegisterIndex();
				const address = this.fetch16();
				const value = this.registers.getUint16(registerFrom);
				this.memory.setUint16(address, value);
				return;
			}

			//Move memory to register
			case instructions.MOV_MEM_REG: {
				const address = this.fetch16();
				const registerTo = this.fetchRegisterIndex();
				const value = this.memory.getUint16(address);
				this.registers.setUint16(registerTo, value);
				return;
			}

			//Add register to register
			case instructions.ADD_REG_REG: {
				const r1 = this.fetchRegisterIndex();
				const r2 = this.fetchRegisterIndex();
				const registerValue1 = this.registers.getUint16(r1 * 2);
				const registerValue2 = this.registers.getUint16(r2 * 2);
				this.setRegister('acc', registerValue1 + registerValue2);
				return;
			}

			case instructions.JMP_NOT_EQ:{
				const value = this.fetch16();
				const address = this.fetch16();

				if(calue !== this.getRegister('acc')){
					this.setRegister('ip', address);
				}

				return;
			}

			case instructions.PSH_LIT: {
				const value = this.fetch16();
				this.push(value);
				return;
			}

			case instructions.PSH_REG:{
				const registerIndex = this.fetchRegisterIndex();
				this.push(this.registers.fetUint16(registerIndex));
				return;
			}

			case instructions.POP: {
				const registerIndex = this.fetchRegisterIndex();
				const value = this.pop();
				this.registers.setUint16(registerIndex, value);
				return;
			}
		}
	}

	step(){
		const instruction = this.fetch();
		return this.execute(instruction);
	}
}

module.exports = CPU;