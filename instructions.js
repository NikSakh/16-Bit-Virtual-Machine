const MOV_LIT_REG = 0x10;
const MOV_REG_REG = 0x11;
const ADD_REG_MEM = 0x12;
const MOV_MEM_REG = 0x13;
const ADD_REG_REG = 0x14;
const JMP_NOT_EQ  = 0x15;
const PSH_LIT     = 0x17;
const PSH_REG     = 0x18;
const POP         = 0x1A;

module.exports = {
	 MOV_LIT_REG,
	 MOV_REG_REG, 
	 ADD_REG_MEM, 
	 MOV_MEM_REG,
 	 ADD_REG_REG,
 	 JMP_NOT_EQ,
 	 PSH_LIT,
 	 PSH_REG,
 	 POP,
};